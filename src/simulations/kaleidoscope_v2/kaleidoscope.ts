import p5 from "p5"
import { Vector } from "../../classes/physics"
import { DrawableObject, ColorProfile } from "./drawable_object"

export class Kaleidoscope {
  private _t = 0

  public constructor(
    public readonly size: Vector,
    public readonly objects: DrawableObject[],
    public readonly colorProfile: ColorProfile,
  ) {}

  public next(): void {
    this.colorProfile.set?.(this._t)
    this.objects.forEach(obj => obj.angle += 0.02)
    this._t += 1
  }

  public draw(p: p5): void {
    this.objects.forEach(obj => obj.draw(p, this.colorProfile))
  }
}