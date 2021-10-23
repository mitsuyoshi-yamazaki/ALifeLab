import p5 from "p5"
import { Model } from "../drawer/model"
import { Line } from "../drawer/line"
import { Vector } from "../../classes/physics"
import { defaultInitialCondition, LSystemRule } from "../drawer/lsystem_rule"
import { LSystemDrawer } from "../drawer/lsystem_drawer"
import { random } from "../../classes/utilities"
import { QuadtreeNode } from "../drawer/quadtree"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"

type RuleState = "growing" | "paused"
type RuleInfo = {
  readonly encodedRule: string
  readonly lines: Line[]
  state: RuleState
  stateTimestamp: number
}

export class InteractiveModel extends Model {
  public get currentRule(): string | null {
    return this._currentRule
  }
  public get numberOfRules(): number {
    return this._runningRuleInfo.size
  }

  private _runningRuleInfo: Map<string, RuleInfo>
  private _worldLines: Line[]
  protected get _lines(): Line[] {
    return Array.from(this._runningRuleInfo.values()).flatMap(ruleInfo => ruleInfo.lines).concat(this._worldLines)
  }
  private _drawTimestamp = 0
  private _currentRule: string | null = null

  public constructor(
    fieldSize: Vector,
    maxLineCount: number,
    private readonly lineLengthType: number,
    private readonly colorTheme: string,
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
    const drawer = this.setupNewDrawer()
    return drawer == null ? [] : [drawer]
  }

  private setupNewDrawer(): LSystemDrawer | null {
    const padding = 100
    const position = (): Vector => {
      return new Vector(random(this.fieldSize.x - padding, padding), random(this.fieldSize.y - padding, padding))
    }
    const direction = (): number => {
      return random(360) - 180
    }

    const rule = this.nextRule()
    if (rule == null) {
      return null
    }

    return this.newDrawer(
      position(),
      direction(),
      defaultInitialCondition,
      rule,
      this.lineLengthType,
      this.colorTheme,
    )
  }

  protected checkCompleted(): void {
    // do nothing
  }

  protected preExecution(): void {
    // do nothing
  }

  private nextRule(): LSystemRule | null {
    if (this.lSystemRules.length <= 0) {
      return null
    }
    return this.lSystemRules[Math.floor(random(this.lSystemRules.length))]
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
    if (growingRules.length < 2) {
      const drawer = this.setupNewDrawer()
      if (drawer != null) {
        console.log(`[NEW] ${drawer.rule.encoded}`)
        this._drawers.push(drawer)
        this._currentRule = drawer.rule.encoded
      }
    }

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
    const direction = (): number => {
      return random(360) - 180
    }

    const drawer = this.newDrawer(
      position,
      direction(),
      defaultInitialCondition,
      rule,
      this.lineLengthType,
      this.colorTheme,
    )

    console.log(`[NEW] ${rule.encoded}`)
    this._drawers.push(drawer)
    this._currentRule = drawer.rule.encoded
  }
}
