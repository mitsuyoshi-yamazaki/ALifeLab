import { Vector } from "../../../src/classes/physics"
import { Line, isCollided } from "../../../src/simulations/drawer/line"

describe("Collision", () => {
  test("Collided", () => {
    const line1 = new Line(new Vector(0, 1), new Vector(3, 1))
    const line2 = new Line(new Vector(2, 0), new Vector(2, 3))
    expect(isCollided(line1, line2)).toBe(false)
  })

  test("Not collided", () => {
    const line1 = new Line(new Vector(0, 1), new Vector(3, 1))
    const line2 = new Line(new Vector(2, 2), new Vector(2, 3))
    const line3 = new Line(new Vector(2, 2), new Vector(3, 2))
    expect(isCollided(line1, line2)).toBe(false)
    expect(isCollided(line2, line3)).toBe(false)
  })
})
