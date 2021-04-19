import { Vector } from "../../classes/physics"
import { LSystemRule } from "../drawer/lsystem_rule"
import { Model, Result } from "../drawer/model"

export class MortalModel extends Model {
  public get result(): Result | null {
    return null // 終了しない
  }

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
    public readonly lineLifeSpan: number,
    fixedStartPoint: boolean,
  ) {
    super(fieldSize, maxLineCount, lSystemRules, mutationRate, 1, fixedStartPoint)
  }

  protected preExecution(): void {
    this.removeOldLines()
  }

  private removeOldLines(): void {
    if (this.lineLifeSpan > 0) {
      const removingLineCount = Math.floor(this._lines.length / this.lineLifeSpan)
      if (this._lines.length <= removingLineCount) {
        return
      }
      const borderLineCount = 4
      const borderLines = this._lines.slice(0, borderLineCount)
      if (this.quadtreeEnabled === true) {
        const removingLines = this._lines.splice(borderLineCount, Math.floor(this._lines.length / this.lineLifeSpan) + borderLineCount)
        removingLines.forEach(line => {
          const node = this.nodeContains(line)
          if (node != null) {
            node.objects = node.objects.filter(obj => obj !== line)
          } else {
            console.log(`Enabled quadtree but no node contains line (${line.start}, ${line.end})`)
          }
        })
      } else {
        this._lines = borderLines.concat(this._lines.slice(removingLineCount + borderLineCount, this._lines.length - borderLineCount))
      }
    }
  }
}
