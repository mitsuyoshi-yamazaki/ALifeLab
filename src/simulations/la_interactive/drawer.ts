import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { InteractiveModel } from "./interactive_model"

type DrawerState = "add rules" | "draw" | "fade"

const executionInterval = 1
const maxNumberOfRules = 3

export class Drawer {
  public get t(): number {
    return this._t
  }

  private _t = 0
  private _model: InteractiveModel
  private _state: DrawerState = "add rules"

  public constructor(
    private readonly fieldSize: Vector,
    private readonly maxLineCount: number,
    private readonly colorTheme: string,
    private readonly rules: VanillaLSystemRule[],
  ) {
    this.reset()
  }

  public next(p: p5): void {
    if (this.t % executionInterval === 0) {
      this._model.execute()
    }
    p.background(0x0, 0xFF)
    this._model.draw(p, false)

    this._t += 1
  }

  public didReceiveTouch(position: Vector): void {
    switch (this._state) {
    case "add rules":
      this._model.addRule(this.randomRule(), position)
      if (this._model.numberOfRules >= maxNumberOfRules) {
        this._state = "draw"
      }
      break
        
    case "draw":
    case "fade":
      this.reset()
      break
    }
  }

  // ---- Private API ---- //
  private reset(): void {
    this._state = "add rules"
    this._model = this.createModel()
  }

  private createModel(): InteractiveModel {
    const lineLengthType = 0

    return new InteractiveModel(
      this.fieldSize,
      this.maxLineCount,
      lineLengthType,
      this.colorTheme,
    )
  }

  private randomRule(): VanillaLSystemRule {
    const randomIndex = Math.floor(random(this.rules.length)) // TODO: 同じものを選ばないような調整等
    return this.rules[randomIndex]
  }
}