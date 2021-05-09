import { ColorPalette } from "./color_palette"

export type State = number

export interface Rule {
  radius: number
  numberOfStates: number
  weights: number[] | null
  colorPalette: ColorPalette

  toString(): string
  nextState(state: State, states: StateMap): State
}

export class StateMap extends Map<State, number> {
  public increment(state: State, count: number): void {
    this.set(state, this.stateCount(state) + count)
  }

  public stateCount(state: State): number {
    return this.get(state) ?? 0
  }
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
