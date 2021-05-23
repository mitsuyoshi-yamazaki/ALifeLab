export type State = number

export class StateMap extends Map<State, number> {
  public increment(state: State, count: number): void {
    this.set(state, this.stateCount(state) + count)
  }

  public stateCount(state: State): number {
    return this.get(state) ?? 0
  }
}