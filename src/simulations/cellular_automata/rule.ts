import { random } from "../../classes/utilities"

export type State = number

export interface Rule {
  radius: number
  numberOfStates: number
  weights: number[]

  nextState(states: Map<State, number>): State
}

export class SimpleMembraneRule implements Rule {
  public numberOfStates = 2
  public get weights(): number[] {
    return this._weights
  }

  private _weights: number[] = []

  public constructor(public readonly radius: number) {
    if (radius <= 0) {
      throw new Error(`Invalid argument: radius should be > 0 (${radius})`)
    }
    for (let i = 0; i <= radius; i += 1) {
      this._weights.push(1)
    }
  }

  public nextState(states: Map<State, number>): State {
    // FixMe: weights計算は面倒なので無視している
    return 1  // TODO:
  }
}