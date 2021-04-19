import { Vector } from "../../classes/physics"
import { Line } from "./line"

export class Action<T> {
  public constructor(public readonly line: Line, public readonly drawers: T[]) { }
}

export class Drawer {
  protected _position: Vector
  protected _direction: number

  public constructor(position: Vector, direction: number) {
    this._position = position
    this._direction = direction
  }

  public next(): Action<Drawer> {
    throw new Error("Not implemented")
  }

  public mutated(): Drawer {
    return this
  }
}
