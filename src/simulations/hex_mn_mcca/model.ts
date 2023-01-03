import { CellState } from "./cell_state"

export type ModelInitializer = (size: number) => CellState[][]

export class Model {
  public get states(): CellState[][] {
    return this._states
  }

  private _states: CellState[][] = []
  
  public constructor(
    public readonly size: number,
  ) {
  }

  public initialize(initializer: ModelInitializer): void {
    this._states = initializer(this.size)
  }

  public step(step: number): void {
  }
}