import { Vector } from "src/classes/physics"
import { Drawable } from "./drawable"
import { Life } from "./life"
import { Terrain } from "./terrain"

type AnyWorldObject = Terrain | Life

export type WorldDrawableState = {
  readonly case: "world"
}

export class World implements Drawable<WorldDrawableState> {
  private terrains: Terrain[]

  public constructor(
    public readonly size: Vector,
  ) {
  }

  public drawableState(): WorldDrawableState {
    return {
      case: "world",
    }
  }

  public calculate(): void {
  }

  public getDrawableObjects(): AnyWorldObject[] {
    return []
  }
}