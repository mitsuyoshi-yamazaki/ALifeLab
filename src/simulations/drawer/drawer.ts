import { Vector } from "../../classes/physics"
import { Line } from "./line"

export class Action {
  public constructor(public readonly line: Line, public readonly drawers: Drawer[]) { }
}

export class Drawer {
  protected _position: Vector
  protected _direction: number

  public constructor(position: Vector, direction: number) {
    this._position = position
    this._direction = direction
  }

  public next(): Action {
    throw new Error("Not implemented")
  }

  public mutated(): Drawer {
    return this
  }
}
