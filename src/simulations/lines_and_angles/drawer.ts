import p5 from "p5"
import { Vector } from "../../classes/physics"
import { LSystemRule } from "../drawer/lsystem_rule"
import { MultiPatternModel } from "./multi_pattern_model"

export class Drawer {
  public get t(): number {
    return this._t
  }

  private get _executionInterval(): number {
    return 20
  }

  private _t = 0
  private _model: MultiPatternModel

  public constructor(
    public readonly fieldSize: Vector,
    rules: LSystemRule[],
  ) {
    this._model = this.createModel(rules)
  }

  public next(p: p5): void {
    if (this.t % this._executionInterval === 0) {
      this._model.execute()
    }
    p.background(0x0, 0xFF)
    this._model.draw(p, false)

    this._t += 1
  }

  private createModel(rules: LSystemRule[]): MultiPatternModel {
    const maxLineCount = 5000
    const mutationRate = 0
    const lineLengthType = 0
    const colorTheme = "grayscale"
    const fixedStartPoint = false
    const addObstacle = false

    const model = new MultiPatternModel(
      new Vector(this.fieldSize.x, this.fieldSize.y),
      maxLineCount,
      rules,
      mutationRate,
      lineLengthType,
      colorTheme,
      fixedStartPoint,
      addObstacle,
    )
    model.showsBorderLine = false
    model.lineCollisionEnabled = true
    model.quadtreeEnabled = true
    model.concurrentExecutionNumber = 1 // TODO: 調整する

    return model
  }

  // progress: 0~1
  private drawRule(p: p5, rule: string, progress: number): void {
    const textSize = 12
    const margin = 10

    const endIndex = Math.min(Math.floor(progress * rule.length), rule.length - 1)
    const displayRule = rule.slice(0, endIndex)

    p.fill(0xFF, 0xC0)
    p.textStyle(p.NORMAL)
    p.textSize(textSize)
    p.text(displayRule, margin, this.fieldSize.y - margin)
  }
}
