import { Color } from "../../classes/color"

export type State = number

export interface Cell {
  state: State
  color: Color
}

export type StateType = Cell

export class StateMap extends Map<State, number> {
  public increment(state: State, count: number): void {
    this.set(state, this.stateCount(state) + count)
  }

  public stateCount(state: State): number {
    return this.get(state) ?? 0
  }
}

export interface Rule extends Cell {
  radius: number
  numberOfStates: number
  weights: number[] | null

  toString(): string
  nextState(state: State, states: StateMap): State
}
