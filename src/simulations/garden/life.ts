import { Vector } from "src/classes/physics"
import { WorldObject } from "./world_object"

export type LifeDrawableState = {
  readonly case: "life"
}

export class Life implements WorldObject<LifeDrawableState> {
  public get position(): Vector {
    return this._position
  }

  private _position: Vector

  public constructor(
    initialPosition: Vector,
  ) {
    this._position = initialPosition
  }

  public drawableState(): LifeDrawableState {
    return {
      case: "life",
    }
  }
}