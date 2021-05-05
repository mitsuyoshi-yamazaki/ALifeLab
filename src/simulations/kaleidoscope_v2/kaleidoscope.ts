import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { DrawableObject, ColorProfile, Square } from "./drawable_object"

export class Kaleidoscope {
  private _objects: DrawableObject[]

  public constructor(public readonly position: Vector) {
    this._objects = [
      new Square(
        this.position,
        this.position,
        0,
        1.0,
        80
      )
    ]
  }

  public draw(p: p5): void {
    const color: ColorProfile = {
      color: Color.white(0xFF, 0x80)
    }

    this._objects.forEach(obj => obj.draw(p, color))
  }
}