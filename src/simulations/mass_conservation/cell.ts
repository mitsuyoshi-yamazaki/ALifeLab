import { Drawable } from "./drawable"

type CellState = {
  readonly mass: number
}

export type CellDrawableState = {
  readonly case: "cell"
  readonly state: CellState
}

export class Cell implements Drawable<CellDrawableState> {
  public get state(): CellState {
    return this._state
  }

  private _state: CellState

  public constructor(
    initialState: CellState,
  ) {
    this._state = initialState
  }

  public drawableState(): CellDrawableState {
    return {
      case: "cell",
      state: this.state,
    }
  }
}