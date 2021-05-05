import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"

export interface ColorProfile {
  color: Color

  set?(t: number): void
}

export interface DrawableObject {
  relativePosition: Vector
  anchorPoint: Vector
  angle: number

  draw(p: p5, color: ColorProfile): void
}

export class Line implements DrawableObject {
  public constructor(
    public readonly relativePosition: Vector,
    public readonly anchorPoint: Vector,
    public angle: number,
    public readonly weight: number,
    public readonly length: number,
  ) { }

  draw(p: p5, color: ColorProfile): void {
    // TODO:
  }
}

export class Oval implements DrawableObject {
  public constructor(
    public readonly relativePosition: Vector,
    public readonly anchorPoint: Vector,
    public angle: number,
    public readonly weight: number,
  ) { }

  draw(p: p5, color: ColorProfile): void {
    // TODO:
  }
}

export class Square implements DrawableObject {
  public constructor(
    public readonly relativePosition: Vector,
    public readonly anchorPoint: Vector,
    public angle: number,
    public readonly weight: number,
    public readonly size: number,
  ) { }

  draw(p: p5, color: ColorProfile): void {
    p.push()
    p.noFill()
    p.strokeWeight(this.weight)
    p.stroke(color.color.p5(p))

    const halfSize = this.size / 2
    p.translate(this.anchorPoint.x, this.anchorPoint.y)
    p.rotate(this.angle)
    p.rect(this.relativePosition.x, this.relativePosition.y, this.size, this.size)
    p.pop()
  }
}
