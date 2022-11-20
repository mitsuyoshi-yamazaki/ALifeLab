import { Vector } from "../../classes/physics"
import { WorldObject } from "./world_object"

type TerrainStateNone = {
  readonly case: "none"
}
type TerrainState = TerrainStateNone
type TerrainStates = TerrainState["case"]

export type TerrainDrawableState = {
  readonly case: "terrain"
  readonly state: TerrainStates
}

export class Terrain implements WorldObject<TerrainDrawableState> {
  private state: TerrainState

  public constructor(
    public readonly position: Vector,
    initialState: TerrainState,
  ) {
    this.state = initialState
  }

  public drawableState(): TerrainDrawableState {
    return {
      case: "terrain",
      state: this.state.case,
    }
  }
}