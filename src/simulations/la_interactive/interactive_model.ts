import p5 from "p5"
import { Model } from "../drawer/model"
import { Line } from "../drawer/line"
import { Vector } from "../../classes/physics"
import { defaultInitialCondition } from "../drawer/lsystem_rule"
import { LSystemDrawer } from "../drawer/lsystem_drawer"
import { random } from "../../classes/utilities"
import { QuadtreeNode } from "../drawer/quadtree"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { CodableRuleInfo } from "./rule_url_parameter_encoder"
import { ColorTheme } from "../drawer/color_theme"

type RuleState = "growing" | "paused"
type RuleInfo = {
  readonly encodedRule: string
  readonly lines: Line[]
  state: RuleState
  stateTimestamp: number
}

export class InteractiveModel extends Model {
  public get numberOfRules(): number {
    return this._runningRuleInfo.size
  }
  public get codableRuleInfo(): CodableRuleInfo[] {
    return [...this._codableRuleInfo]
  }
  public get calculationStopped(): boolean {
    const lineLimitReached = Array.from(this._runningRuleInfo.values()).every(info => info.lines.length >= this.maxLineCount)
    const drawersDied = this._drawers.length <= 0
    return lineLimitReached || drawersDied
  }

  private _runningRuleInfo: Map<string, RuleInfo>
  private _worldLines: Line[]
  protected get _lines(): Line[] {
    return Array.from(this._runningRuleInfo.values()).flatMap(ruleInfo => ruleInfo.lines).concat(this._worldLines)
  }
  private _drawTimestamp = 0
  private _codableRuleInfo: CodableRuleInfo[] = []

  public constructor(
    fieldSize: Vector,
    maxLineCount: number,
    private readonly lineLengthType: number,
    private readonly colorTheme: ColorTheme,
  ) {
    super(
      fieldSize,
      maxLineCount,
      [], // lSystemRules
      0,  // mutationRate
      lineLengthType,
      colorTheme,
      false,  // fixedStartPoint
      false,  // addObstacle
    )
  }

  protected initializeMembers(): void {  // fuck
    this._runningRuleInfo = new Map<string, RuleInfo>()
    this._worldLines = []
  }

  protected setupFirstDrawers(): LSystemDrawer[] {
    return []
  }

  protected checkCompleted(): void {
    // do nothing
  }

  protected preExecution(): void {
    // do nothing
  }

  protected executeSteps(drawerCount: number): void {
    if (this.isCompleted === true || drawerCount <= 0) {
      return
    }
    this.checkCompleted()
    if (this._drawers.length <= 0) {
      return
    }
    drawerCount -= this._drawers.length

    this.preExecution()

    const growingRules: string[] = []

    const newDrawers: LSystemDrawer[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      if (this.quadtreeEnabled) {
        const node = this.nodeContains(action.line)

        // Since this._rootNode.nodeContains() returns null, the line is crossing this model's border
        if (node != null && this.isCollidedQuadtree(action.line, node) === false) {
          const encodedRule = drawer.rule.encoded
          if (growingRules.includes(encodedRule) !== true) {
            growingRules.push(encodedRule)
          }
          newDrawers.push(...action.drawers)
          node.objects.push(action.line)
          const lines = ((): Line[] => {
            const stored = this._runningRuleInfo.get(encodedRule)
            if (stored != null) {
              return stored.lines
            }
            console.log(`addRule時に追加されているはず ${encodedRule}`)
            const newInfo: RuleInfo = {
              encodedRule,
              lines: [],
              state: "growing",
              stateTimestamp: this._drawTimestamp,
            }
            this._runningRuleInfo.set(encodedRule, newInfo)
            return newInfo.lines
          })()
          lines.push(action.line)
        }
      } else {
        console.log("四分木なしは未実装")
      }
    })

    Array.from(this._runningRuleInfo.values()).forEach(ruleInfo => {
      if (growingRules.includes(ruleInfo.encodedRule) === true) {
        return
      }
      switch (ruleInfo.state) {
      case "growing":
        ruleInfo.state = "paused"
        ruleInfo.stateTimestamp = this._drawTimestamp
        return
      case "paused":
        return
      }
    })

    this._drawers = newDrawers.map(drawer => {
      // if (random(1) < this.mutationRate) {
      //   return drawer.mutated()
      // }

      return drawer
    })

    this.checkPatternState()

    this._t += 1
    this.executeSteps(drawerCount)
  }

  private checkPatternState(): void {
    const rulesToRemove: RuleInfo[] = []
    const drawersToRemove: string[] = []

    Array.from(this._runningRuleInfo.values())
      .flatMap(ruleInfo => {
        switch (ruleInfo.state) {
        case "growing":
          if (ruleInfo.lines.length < this.maxLineCount) {
            return
          }
          ruleInfo.state = "paused"
          ruleInfo.stateTimestamp = this._drawTimestamp
          drawersToRemove.push(ruleInfo.encodedRule)
          return

        case "paused":
          return
        }
      })

    rulesToRemove.forEach(ruleInfo => {
      console.log(`[FINISHED] ${ruleInfo.encodedRule}`)
      ruleInfo.lines.forEach(line => this.removeLine(line))
      this._runningRuleInfo.delete(ruleInfo.encodedRule)
    })
    this._rootNode.trim()

    this._drawers = this._drawers.filter(drawer => drawersToRemove.includes(drawer.rule.encoded) !== true)
  }

  // 親クラスからの呼び出しの対応
  protected addLine(line: Line, node: QuadtreeNode | null): void {
    if (this.quadtreeEnabled === true && node != null) {
      node.objects.push(line)
    }
    this._worldLines.push(line)
  }

  public draw(p: p5, showsQuadtree: boolean): void {
    this._drawTimestamp += 1
    if (showsQuadtree === true) {
      this._rootNode.draw(p)
    }
    Array.from(this._runningRuleInfo.values()).forEach(ruleInfo => {
      switch (ruleInfo.state) {
      case "growing":
      case "paused":
        ruleInfo.lines.forEach(line => this.drawLine(line, 0x80, 0.5, p))
        return
      }
    })
  }

  // Public API
  public addRule(rule: VanillaLSystemRule, position: Vector): void {
    const direction = random(360) - 180

    const drawer = this.newDrawer(
      position,
      direction,
      defaultInitialCondition,
      rule,
      this.lineLengthType,
      this.colorTheme,
    )

    const encodedRule = rule.encoded
    console.log(`[NEW] ${encodedRule}`)
    this._drawers.push(drawer)

    const newInfo: RuleInfo = {
      encodedRule,
      lines: [],
      state: "growing",
      stateTimestamp: this._drawTimestamp,
    }
    this._runningRuleInfo.set(encodedRule, newInfo)
    this._codableRuleInfo.push({
      position: position,
      angle: direction,
      lineCount: this.maxLineCount,
      rule,
    })
  }
}
