import { Vector } from "../../classes/physics"
import { Cell } from "./cell"
import { Drawable } from "./drawable"

type DrawableWorldObjects = Cell

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

  public getDrawableObjects(): DrawableWorldObjects[] {
    return []
  }
}