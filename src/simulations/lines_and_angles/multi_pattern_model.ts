import { Model } from "../drawer/model"
import { Line } from "../drawer/line"
import { Vector } from "../../classes/physics"
import { defaultInitialCondition, LSystemRule } from "../drawer/lsystem_rule"
import { LSystemDrawer } from "../drawer/lsystem_drawer"
import { random } from "../../classes/utilities"
import { QuadtreeNode } from "../drawer/quadtree"

const systemLineKey = ""

/**
 * - [ ] 成長の止まったruleを削除
 */
export class MultiPatternModel extends Model {
  private _linesForRule: Map<string, Line[]>
  protected get _lines(): Line[] {
    return Array.from(this._linesForRule.values()).flatMap(lines => lines)
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

  protected initializeMembers(): void {
    this._linesForRule = new Map<string, Line[]>()  // fuck
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

    const growingRules: string[] = [systemLineKey]

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
            const stored = this._linesForRule.get(drawer.rule.encoded)
            if (stored != null) {
              return stored
            }
            const newList: Line[] = []
            this._linesForRule.set(drawer.rule.encoded, newList)
            return newList
          })()
          lines.push(action.line)
        }
      } else {
        console.log("四分木なしは未実装")
      }
    })

    const deadRules = Array.from(this._linesForRule.keys()).filter(rule => growingRules.includes(rule) !== true)
    deadRules.forEach(rule => this._linesForRule.delete(rule))
    
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
    const rulesToRemove: { rule: string, lines: Line[] }[] = this.lSystemRules
      .flatMap(rule => {
        const encodedRule = rule.encoded
        const lines = this._linesForRule.get(encodedRule)
        if (lines == null) {
          return []
        }
        if (lines.length < this.maxLineCount) {
          return []
        }
        return {
          rule: encodedRule,
          lines,
        }
      })

    rulesToRemove.forEach(({ rule, lines }) => {
      console.log(`[FINISHED] ${rule}`)
      lines.forEach(line => this.removeLine(line))
      this._linesForRule.delete(rule)
    })

    const encodedRulesToRemove = rulesToRemove.map(({ rule }) => rule)
    this._drawers = this._drawers.filter(drawer => encodedRulesToRemove.includes(drawer.rule.encoded) !== true)
  }

  // 親クラスからの呼び出しの対応
  protected addLine(line: Line, node: QuadtreeNode | null): void {
    if (this.quadtreeEnabled === true && node != null) {
      node.objects.push(line)
    }
    const lines = ((): Line[] => {
      const stored = this._linesForRule.get(systemLineKey)
      if (stored != null) {
        return stored
      }
      const newList: Line[] = []
      this._linesForRule.set(systemLineKey, newList)
      return newList
    })()
    lines.push(line)
  }
}
