export type State = number

export interface Rule {
  radius: number
  numberOfStates: number
  weights: number[]

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

  public toString(): string {
    return "Simple membrane automaton"
  }

  public nextState(state: State, states: StateMap): State {
    // FixMe: weights計算は面倒なので無視している
    states.increment(state, 1)
    return states.stateCount(0) > states.stateCount(1) ? 0 : 1
  }
}