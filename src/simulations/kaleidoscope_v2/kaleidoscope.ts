import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { DrawableObject, ColorProfile, Square } from "./drawable_object"

export class Kaleidoscope {
  private _t = 0
  private _objects: DrawableObject[]

  public constructor(public readonly size: Vector) {
    this._objects = [
      new Square(
        Vector.zero(),
        new Vector(200, 200),
        0,
        1.0,
        80
      ),
      new Square(
        new Vector(10, 10),
        new Vector(400, 200),
        0,
        1.0,
        80
      )
    ]
  }

  public next(): void {
    this._objects.forEach(obj => obj.angle += 0.02)
    this._t += 1
  }

  public draw(p: p5): void {
    const color: ColorProfile = {
      color: Color.white(0xFF, 0x80)
    }

    this._objects.forEach(obj => obj.draw(p, color))
  }
}