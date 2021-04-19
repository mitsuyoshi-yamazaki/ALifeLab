import { Vector } from "../../classes/physics"
import { LSystemRule } from "../drawer/lsystem_rule"
import { Model } from "../drawer/model"

export class MortalModel extends Model {
  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
    public readonly lineLifeSpan: number,
    public readonly lineLengthType: number,
    fixedStartPoint: boolean,
  ) {
    super(fieldSize, maxLineCount, lSystemRules, mutationRate, lineLengthType, fixedStartPoint)
  }

  protected preExecution(): void {
    if (this.lineLifeSpan > 0) {
      if (this._lines.length > this.lineLifeSpan) {
        if (this.quadtreeEnabled) {
          throw new Error("TODO: 四分木から線分を削除する処理を実装する")
        }
        const initLine = this._lines.slice(0, 4)
        this._lines = initLine.concat(this._lines.slice(Math.floor(this._lines.length / this.lineLifeSpan) + 5, this._lines.length - 4))
      }
    }
  }
}
