import { Vector } from "../../classes/physics"
import { Drawable } from "./drawable"
import { Life } from "./life"
import { TerrainState } from "./terrain"

type AnyWorldObject = Life

export type WorldDrawableState = {
  readonly case: "world"
  readonly terrains: TerrainState[][]
}

export class World implements Drawable<WorldDrawableState> {
  private terrains: TerrainState[][]
  private lives: Life[]

  public constructor(
    public readonly size: Vector,
    initialTerrains: TerrainState[][],
    initialLives: Life[],
  ) {
    this.terrains = initialTerrains
    this.lives = initialLives
  }

  public drawableState(): WorldDrawableState {
    return {
      case: "world",
      terrains: this.terrains,
    }
  }

  public calculate(): void {
  }

  public getDrawableObjects(): AnyWorldObject[] {
    return [
      ...this.lives,
    ]
  }
}