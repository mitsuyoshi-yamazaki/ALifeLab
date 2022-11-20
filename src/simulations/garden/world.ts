import { Vector } from "src/classes/physics"
import { Drawable } from "./drawable"

export type WorldDrawableState = {
  readonly case: "world"
}

export class World implements Drawable<WorldDrawableState> {
  

  public constructor(
    public readonly size: Vector,
  ) {
  }

  public drawableState(): WorldDrawableState {
    return {
      case: "world",
    }
  }
}