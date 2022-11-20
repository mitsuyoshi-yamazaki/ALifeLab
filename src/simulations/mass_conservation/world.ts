import { Vector } from "../../classes/physics"
import { Drawable } from "./drawable"

export type CellState = {
  mass: number
}

export type WorldDrawableState = {
  readonly case: "world"
  readonly cellStates: CellState[][]
}

export class World implements Drawable<WorldDrawableState> {
  private cells: CellState[][]

  public constructor(
    public readonly size: Vector,
    initialStates: CellState[][],
  ) {
    this.cells = initialStates
  }

  public drawableState(): WorldDrawableState {
    return {
      case: "world",
      cellStates: this.cells,
    }
  }

  public calculate(): void {
  }
}