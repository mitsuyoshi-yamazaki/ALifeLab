import p5 from "p5"
import { Vector } from "../../classes/physics"

export class Model {
  public get t(): number {
    return this._t
  }

  private _t = 0

  public constructor(public readonly size: Vector) {

  }

  public next(): void {
    this._t += 1
  }

  public draw(p: p5): void {

  }
}