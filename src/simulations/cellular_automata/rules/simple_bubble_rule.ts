import { State, StateMap, Rule } from "../rule"
import { ColorPalette } from "../color_palette"

export class SimpleBubbleRule implements Rule {
  public numberOfStates = 2
  public get weights(): number[] {
    return this._weights
  }

  private _weights: number[] = []

  public constructor(public readonly radius: number, public readonly colorPalette: ColorPalette) {
    if (radius <= 0) {
      throw new Error(`Invalid argument: radius should be > 0 (${radius})`)
    }
    for (let i = 0; i <= radius; i += 1) {
      this._weights.push(1)
    }
  }

  public toString(): string {
    return `SimpleBubbleRule with ${this.colorPalette.toString()}`
  }

  public nextState(state: State, states: StateMap): State {
    // FixMe: weights計算は面倒なので無視している
    states.increment(state, 1)
    return states.stateCount(0) > states.stateCount(1) ? 0 : 1
  }
}
