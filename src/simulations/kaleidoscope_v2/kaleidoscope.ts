import p5 from "p5"
import { Vector } from "../../classes/physics"
import { DrawableObject, ColorProfile, Square } from "./drawable_object"

export class Kaleidoscope {
  private _t = 0

  public constructor(
    public readonly size: Vector,
    public readonly objects: DrawableObject[],
    public readonly colorProfile: ColorProfile,
    public readonly changeSize: boolean,
  ) {}

  public next(): void {
    this.colorProfile.set?.(this._t)
    this.objects.forEach(obj => {
      obj.angle += 0.02
      if (this.changeSize) {
        (obj as Square).size = 50 + Math.abs((this._t % 500) - 250) / 5
      }
    })
    this._t += 1
  }

  public draw(p: p5): void {
    this.objects.forEach(obj => obj.draw(p, this.colorProfile))
  }
}