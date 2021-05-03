import p5 from "p5"
import { Vector } from "../../classes/physics"
import { LSystemRule } from "../drawer/lsystem_rule"
import { Model } from "../drawer/model"

export class CellDivisionModel extends Model {
  

  protected checkCompleted(): void {
    if (this._lines.length > this.maxLineCount) {
      this._result = this.currentResult("Filled")
    }
    if (this._drawers.length === 0) {
      this._result = this.currentResult("All died")
    }
  }
}
