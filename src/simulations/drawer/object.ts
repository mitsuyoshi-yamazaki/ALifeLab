import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"

export function isCollided(line1: Line, line2: Line): boolean {
  // http://www.jeffreythompson.org/collision-detection/line-line.php

  // calculate the distance to intersection point
  const uA = ((line2.end.x - line2.start.x) * (line1.start.y - line2.start.y)
    - (line2.end.y - line2.start.y) * (line1.start.x - line2.start.x))
    / ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)
      - (line2.end.x - line2.start.x) * (line1.end.y - line1.start.y))
  const uB = ((line1.end.x - line1.start.x) * (line1.start.y - line2.start.y)
    - (line1.end.y - line1.start.y) * (line1.start.x - line2.start.x))
    / ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)
      - (line2.end.x - line2.start.x) * (line1.end.y - line1.start.y))

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // const intersectionX = line1.start.x + (uA * (line1.end.x - line1.start.x))
    // const intersectionY = line1.start.y + (uA * (line1.end.y - line1.start.y))

    return true
  }

  return false
}

export class Line {
  public constructor(
    public readonly start: Vector,
    public readonly end: Vector,
    public readonly weight: number,
    public readonly color: Color,
  ) { }

  public draw(p: p5) {
    p.stroke(this.color.p5(p))
    p.strokeWeight(this.weight)
    p.line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}
