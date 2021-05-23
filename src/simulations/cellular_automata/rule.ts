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

const presetRules = [
  "bubble",
  "membrane",
  "droplet",
  "hydrophilic",
] as const
export type PresetRule = typeof presetRules[number]

export const isPresetRule = (obj: string): obj is PresetRule => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return presetRules.includes(obj as any)
}
