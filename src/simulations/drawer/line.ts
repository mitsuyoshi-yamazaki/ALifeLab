import p5 from "p5"
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
    const intersectionX = line1.start.x + (uA * (line1.end.x - line1.start.x))
    const intersectionY = line1.start.y + (uA * (line1.end.y - line1.start.y))

    // 端で接している場合は許容
    if (intersectionX === line1.start.x && intersectionY === line1.start.y) {
      return false
    } else if (intersectionX === line1.end.x && intersectionY === line1.end.y) {
      return false
    }

    return true
  }

  return false
}

export class Line {
  public weight = 0.5
  public isHidden = false

  public constructor(
    public readonly start: Vector,
    public readonly end: Vector,
  ) { }

  public draw(p: p5) {
    if (this.isHidden === true) {
      return
    }

    p.stroke(0xFF, 0x80)
    p.strokeWeight(this.weight)
    p.line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}

export class LinkedLine extends Line {
  public children: LinkedLine[] = []
  public fixedWeight: number | undefined
  public isHidden = false

  public constructor(start: Vector, end: Vector) {
    super(start, end)
  }

  public get numberOfLeaves(): number {
    if (this.children.length === 0) {
      return 1
    }

    return this.children.reduce((result, child) => result + child.numberOfLeaves, 0)
  }

  public draw(p: p5) {
    if (this.isHidden === true) {
      return
    }

    const weight = this.fixedWeight ?? ((1 - 1 / (this.numberOfLeaves + 1)) * 5)

    p.stroke(0xFF, 0x80)
    p.strokeWeight(weight)
    p.line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}
