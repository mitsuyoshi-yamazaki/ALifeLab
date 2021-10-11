import { Model } from "../drawer/model"
import { Line } from "../drawer/line"
import { Vector } from "../../classes/physics"
import { defaultInitialCondition, LSystemRule } from "../drawer/lsystem_rule"
import { LSystemDrawer } from "../drawer/lsystem_drawer"
import { random } from "../../classes/utilities"
import { QuadtreeNode } from "../drawer/quadtree"

type RuleState = "growing" | "paused" | "fade"
type RuleInfo = {
  readonly encodedRule: string
  readonly lines: Line[]
  state: RuleState
  stateTimestamp: number
}

/**
 * - [ ] 成長の止まったruleを削除
 */
export class MultiPatternModel extends Model {
  private _runningRuleInfo: Map<string, RuleInfo>
  private _worldLines: Line[]
  protected get _lines(): Line[] {
    return Array.from(this._runningRuleInfo.values()).flatMap(ruleInfo => ruleInfo.lines).concat(this._worldLines)
  }

  public constructor(
    fieldSize: Vector,
    maxLineCount: number,
    lSystemRules: LSystemRule[],
    mutationRate: number,
    private readonly lineLengthType: number,
    private readonly colorTheme: string,
    fixedStartPoint: boolean,
    addObstacle: boolean,
  ) {
    super(
      fieldSize,
      maxLineCount,
      lSystemRules,
      mutationRate,
      lineLengthType,
      colorTheme,
      fixedStartPoint,
      addObstacle,
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
            const encodedRule = drawer.rule.encoded
            const stored = this._runningRuleInfo.get(encodedRule)
            if (stored != null) {
              return stored.lines
            }
            const newInfo: RuleInfo = {
              encodedRule,
              lines: [],
              state: "growing",
              stateTimestamp: this.t,
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

    const deadRules = Array.from(this._runningRuleInfo.keys()).filter(rule => growingRules.includes(rule) !== true)
    deadRules.forEach(rule => this._runningRuleInfo.delete(rule))
    
    this._drawers = newDrawers.map(drawer => {
      // if (random(1) < this.mutationRate) {
      //   return drawer.mutated()
      // }

      return drawer
    })

    this.removeDeadRules()
    if (growingRules.length <= 2) {
      const drawer = this.setupNewDrawer()
      if (drawer != null) {
        console.log(`[NEW] ${drawer.rule.encoded}`)
        this._drawers.push(drawer)
      }
    }

    this._t += 1
    this.executeSteps(drawerCount)
  }

  private removeDeadRules(): void {
    const rulesToRemove: RuleInfo[] = this.lSystemRules
      .flatMap(rule => {
        const encodedRule = rule.encoded
        const ruleInfo = this._runningRuleInfo.get(encodedRule)
        if (ruleInfo == null) {
          return []
        }
        if (ruleInfo.lines.length < this.maxLineCount) {
          return []
        }
        return ruleInfo
      })

    rulesToRemove.forEach(ruleInfo => {
      console.log(`[FINISHED] ${ruleInfo.encodedRule}`)
      ruleInfo.lines.forEach(line => this.removeLine(line))
      this._runningRuleInfo.delete(ruleInfo.encodedRule)
    })

    const encodedRulesToRemove = rulesToRemove.map(ruleInfo => ruleInfo.encodedRule)
    this._drawers = this._drawers.filter(drawer => encodedRulesToRemove.includes(drawer.rule.encoded) !== true)
  }

  // 親クラスからの呼び出しの対応
  protected addLine(line: Line, node: QuadtreeNode | null): void {
    if (this.quadtreeEnabled === true && node != null) {
      node.objects.push(line)
    }
    this._worldLines.push(line)
  }
}
