import { Rule } from "../rule"
import { State, StateMap } from "../state"
import { ColorPalette } from "../color_palette"

export class SimpleBubbleRule implements Rule {
  public readonly numberOfStates = 2
  public readonly weights = null

  public constructor(public readonly radius: number, public readonly colorPalette: ColorPalette) {
    if (radius <= 0) {
      throw new Error(`Invalid argument: radius should be > 0 (${radius})`)
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
