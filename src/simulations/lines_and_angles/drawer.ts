import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { LSystemRule } from "../drawer/lsystem_rule"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { ImmortalModel } from "../drawer/model"
import { MultiPatternModel } from "./multi_pattern_model"

type DrawState = "draw" | "fade_rule" | "pause" | "fade"

export class Drawer {
  public get t(): number {
    return this._t
  }

  private get _executionInterval(): number {
    return 2
  }

  private _t = 0
  private _model: MultiPatternModel

  private _drawState: DrawState = "draw"
  private _stateTimestamp = 0

  public constructor(
    public readonly fieldSize: Vector,
    rules: LSystemRule[],
  ) {
    this._model = this.createModel(rules)
  }

  public next(p: p5): void {
    // switch (this._drawState) {
    // case "draw":
      if (this.t % this._executionInterval === 0) {
        this._model.execute()
      }
      p.background(0x0, 0xFF)
        this._model.draw(p, false)
        if (this._model.result != null) {
        this._drawState = "fade_rule"
        this._stateTimestamp = 0
      }
    //   break
      
    // case "fade_rule": {
    //   p.background(0x0, 0xFF)
    //     this._model.draw(p, false)
    //     const rule = this._model.encoded
    //   const maxTimestamp = rule.length
    //   this.drawRule(p, rule, this._stateTimestamp / maxTimestamp) // progressを文字あたり一定の速度にする
    //   if (this._stateTimestamp >= maxTimestamp) {
    //     this._drawState = "pause"
    //     this._stateTimestamp = 0
    //   }
    //   break
    // }
      
    // case "pause":
    //   p.background(0x0, 0xFF)
    //     this._model.draw(p, false)
    //     this.drawRule(p, this._model.encoded, 1)
    //   if (this._stateTimestamp > 150) {
    //     this._drawState = "fade"
    //     this._stateTimestamp = 0
    //   }
    //   break
      
    // case "fade": {
    //   const maxTimestamp = 80
    //   p.fill(0x0, 0xFF * (1 / maxTimestamp))
    //   p.rect(0, 0, this.fieldSize.x, this.fieldSize.y)
    //   if (this._stateTimestamp >= maxTimestamp) {
    //     this._currentModel = this.createModel()
    //     this._drawState = "draw"
    //     this._stateTimestamp = 0
    //   }
    //   break
    // }
    // }

    this._stateTimestamp += 1
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
    model.concurrentExecutionNumber = 50 // TODO: 調整する

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
