import { CellState } from "./cell_state"
import { GrowthFunction } from "./growth_function"
import { Kernel } from "./kernel"

export type ModelInitializer = (size: number) => CellState[][]

export class Model {
  public get states(): CellState[][] {
    return this._states
  }

  private _states: CellState[][] = []
  
  public constructor(
    public readonly size: number,
    public readonly kernel: Kernel,
    public readonly growthFunction: GrowthFunction,
  ) {
  }

  public initialize(initializer: ModelInitializer): void {
    this._states = initializer(this.size)
  }

  public step(step: number): void {
  }
}