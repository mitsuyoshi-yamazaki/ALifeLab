import { Model } from "../drawer/model"
import { Line } from "../drawer/line"
import { Vector } from "../../classes/physics"
import { defaultInitialCondition, LSystemRule } from "../drawer/lsystem_rule"
import { LSystemDrawer } from "../drawer/lsystem_drawer"
import { random } from "../../classes/utilities"
import { QuadtreeNode } from "../drawer/quadtree"

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
    lineLengthType: number,
    colorTheme: string,
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

  protected setupFirstDrawers(rules: LSystemRule[], fixedStartPoint: boolean, lineLengthType: number, colorTheme: string): LSystemDrawer[] {
    const padding = 100
    const position = (): Vector => {
      return new Vector(random(this.fieldSize.x - padding, padding), random(this.fieldSize.y - padding, padding))
    }
    const direction = (): number => {
      return random(360) - 180
    }

    const rule = this.nextRule()
    if (rule == null) {
      return []
    }

    return [
      this.newDrawer(
        position(),
        direction(),
        defaultInitialCondition,
        rule,
        lineLengthType,
        colorTheme,
      )
    ]
  }

  protected checkCompleted(): void {
    // do nothing
  }

  protected preExecution(): void {
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

    const encodedRulesToRemove = rulesToRemove.map(({rule}) => rule)
    this._drawers = this._drawers.filter(drawer => encodedRulesToRemove.includes(drawer.rule.encoded) !== true)
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

    const newDrawers: LSystemDrawer[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      if (this.quadtreeEnabled) {
        const node = this.nodeContains(action.line)

        // Since this._rootNode.nodeContains() returns null, the line is crossing this model's border
        if (node != null && this.isCollidedQuadtree(action.line, node) === false) {
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

    this._drawers = newDrawers.map(drawer => {
      if (random(1) < this.mutationRate) {
        return drawer.mutated()
      }

      return drawer
    })

    this._t += 1
    this.executeSteps(drawerCount)
  }

  // 親クラスからの呼び出しの対応
  protected addLine(line: Line, node: QuadtreeNode | null): void {
    if (this.quadtreeEnabled === true && node != null) {
      node.objects.push(line)
    }
    const lines = ((): Line[] => {
      const systemLineKey = ""
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
