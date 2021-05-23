import { ColorPalette } from "./color_palette"
import { State, StateMap } from "./state"

export interface Rule {
  radius: number
  numberOfStates: number
  weights: number[] | null
  colorPalette: ColorPalette

  toString(): string
  nextState(state: State, states: StateMap): State
}
