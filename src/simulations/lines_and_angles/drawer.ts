import p5 from "p5"
import { Vector } from "../../classes/physics"
import { LSystemRule } from "../drawer/lsystem_rule"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { MultiPatternModel } from "./multi_pattern_model"

const ruleFadeDuration = 50
const resetInterval = 1000 * 60 * 30 // ms // FixMe: 長時間稼働し続けると停止する問題があるため

export class Drawer {
  public get t(): number {
    return this._t
  }

  private get _executionInterval(): number {
    return 10
  }

  private _t = 0
  private _model: MultiPatternModel
  private _currentRule: string | null = null
  private _ruleChangedAt = 0
  private _modelCreatedAt = Date.now()

  public constructor(
    public readonly fieldSize: Vector,
    public readonly rules: LSystemRule[],
  ) {
    this._model = this.createModel(rules)
  }

  public next(p: p5): void {
    if ((Date.now() - this._modelCreatedAt) > resetInterval) {
      console.log(`[RESET] at ${Date.now()}`)
      this._model = this.createModel(this.rules)
    }

    if (this.t % this._executionInterval === 0) {
      this._model.execute()
      if (this._currentRule !== this._model.currentRule) {
        this._currentRule = this._model.currentRule
        this._ruleChangedAt = this.t
      }
    }
    p.background(0x0, 0xFF)
    this._model.draw(p, false)

    if (this._currentRule != null) {
      const progress = Math.min(this._t - this._ruleChangedAt, ruleFadeDuration) / ruleFadeDuration
      this.drawRule(p, this._currentRule, progress)
    }

    this._t += 1
  }

  private createModel(rules: LSystemRule[]): MultiPatternModel {
    this._modelCreatedAt = Date.now()

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
    rule = rule.replace(/,/g, "").replace(/:\./g, "").replace(/;/g, ",")

    const textSize = 12
    const margin = 40

    const endIndex = Math.min(Math.floor(progress * rule.length), rule.length)
    const displayRule = rule.slice(0, endIndex)

    p.fill(0xFF, 0xC0)
    p.textStyle(p.NORMAL)
    p.textSize(textSize)
    p.text(displayRule, margin, this.fieldSize.y - margin)
  }

  public addRule(rule: VanillaLSystemRule, position: Vector): void {
    this._model.addRule(rule, position)
  }
}
