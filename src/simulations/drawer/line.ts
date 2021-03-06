import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { QuadtreeObject } from "./quadtree"

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

    // 端で接している場合は許容: line2の計算を行っていないが、line2の一端がline1の中央に接するという条件で漏れるだけなので今回の仕様ではほぼ起きないだろう
    if (intersectionX === line1.start.x && intersectionY === line1.start.y) {
      return false
    } else if (intersectionX === line1.end.x && intersectionY === line1.end.y) {
      return false
    }

    return true
  }

  return false
}

export class Line implements QuadtreeObject {
  public isHidden = false
  public color = Color.white(0xFF, 0x80)
  public get edgePoints(): Vector[] {
    return [
      this.start,
      this.end,
    ]
  }

  public constructor(
    public readonly start: Vector,
    public readonly end: Vector,
  ) { }

  /*
   * return value:
   * [
   *   ((0, 0), (0, size.y)),
   *   ((0, 0), (size.x, 0)),
   *   ((size.x, size.y), (0, size.y)),
   *   ((size.x, size.y), (size.x, 0)),
   * ].map(v => v + origin)
   */
  public static rect(origin: Vector, size: Vector): Line[] {
    const rect: Line[] = []
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        rect.push(new Line(
          new Vector(i * size.x + origin.x, i * size.y + origin.y),
          new Vector(j * size.x + origin.x, ((j + 1) % 2) * size.y + origin.y),
        ))
      }
    }
    return rect
  }
}
