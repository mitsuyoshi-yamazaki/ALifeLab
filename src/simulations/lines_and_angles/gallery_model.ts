import p5 from "p5"
import { Vector } from "../../classes/physics"
import { LSystemRule } from "../drawer/lsystem_rule"
import { Model } from "../drawer/model"

export class GalleryModel extends Model {
  private _lineWeight = 0.5

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
    lineLengthType: number,
    colorTheme: string,
    fixedStartPoint: boolean,
    addObstacle: boolean,
  ) {
    super(fieldSize, maxLineCount, lSystemRules, mutationRate, lineLengthType, colorTheme, fixedStartPoint, addObstacle)
    if (colorTheme === "direction") {
      this._lineWeight = 1.0
    }
  }

  public draw(p: p5, showsQuadtree: boolean): void {
    if (showsQuadtree === true) {
      this._rootNode.draw(p)
    }
    this._lines.forEach(line => this.drawLine(line, 0x80, this._lineWeight, p))
  }

  protected checkCompleted(): void {
    if (this._lines.length > this.maxLineCount) {
      this._result = this.currentResult("Filled")
    }
    if (this._drawers.length === 0) {
      this._result = this.currentResult("All died")
    }
  }
}
