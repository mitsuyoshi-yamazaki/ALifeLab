import { Vector } from "../../../src/classes/physics"
import { Line, isCollided } from "../../../src/simulations/drawer/line"

describe("Collision", () => {
  test("Collided", () => {
    const line1 = new Line(new Vector(0, 1), new Vector(3, 1))
    const line2 = new Line(new Vector(2, 0), new Vector(2, 3))
    expect(isCollided(line1, line2)).toBe(true)
  })

  test("Not collided", () => {
    const line1 = new Line(new Vector(0, 1), new Vector(3, 1))
    const line2 = new Line(new Vector(2, 2), new Vector(2, 3))
    const line3 = new Line(new Vector(2, 2), new Vector(3, 2))
    expect(isCollided(line1, line2)).toBe(false)
    expect(isCollided(line2, line3)).toBe(false)
  })
})

describe("Rect", () => {
  test("Zero origin", () => {
    const rect = Line.rect(Vector.zero(), new Vector(100, 200))

    expect(rect[0].start.x).toBe(0)
    expect(rect[0].start.y).toBe(0)
    expect(rect[0].end.x).toBe(0)
    expect(rect[0].end.y).toBe(200)

    expect(rect[1].start.x).toBe(0)
    expect(rect[1].start.y).toBe(0)
    expect(rect[1].end.x).toBe(100)
    expect(rect[1].end.y).toBe(0)

    expect(rect[2].start.x).toBe(100)
    expect(rect[2].start.y).toBe(200)
    expect(rect[2].end.x).toBe(0)
    expect(rect[2].end.y).toBe(200)

    expect(rect[3].start.x).toBe(100)
    expect(rect[3].start.y).toBe(200)
    expect(rect[3].end.x).toBe(100)
    expect(rect[3].end.y).toBe(0)
  })

  test("Positive origin", () => {
    const rect = Line.rect(new Vector(20, 10), new Vector(100, 200))

    expect(rect[0].start.x).toBe(20)
    expect(rect[0].start.y).toBe(10)
    expect(rect[0].end.x).toBe(20)
    expect(rect[0].end.y).toBe(210)

    expect(rect[1].start.x).toBe(20)
    expect(rect[1].start.y).toBe(10)
    expect(rect[1].end.x).toBe(120)
    expect(rect[1].end.y).toBe(10)

    expect(rect[2].start.x).toBe(120)
    expect(rect[2].start.y).toBe(210)
    expect(rect[2].end.x).toBe(20)
    expect(rect[2].end.y).toBe(210)

    expect(rect[3].start.x).toBe(120)
    expect(rect[3].start.y).toBe(210)
    expect(rect[3].end.x).toBe(120)
    expect(rect[3].end.y).toBe(10)
  })

  test("Negative origin", () => {
    const rect = Line.rect(new Vector(-10, -20), new Vector(100, 200))

    expect(rect[0].start.x).toBe(-10)
    expect(rect[0].start.y).toBe(-20)
    expect(rect[0].end.x).toBe(-10)
    expect(rect[0].end.y).toBe(180)

    expect(rect[1].start.x).toBe(-10)
    expect(rect[1].start.y).toBe(-20)
    expect(rect[1].end.x).toBe(90)
    expect(rect[1].end.y).toBe(-20)

    expect(rect[2].start.x).toBe(90)
    expect(rect[2].start.y).toBe(180)
    expect(rect[2].end.x).toBe(-10)
    expect(rect[2].end.y).toBe(180)

    expect(rect[3].start.x).toBe(90)
    expect(rect[3].start.y).toBe(180)
    expect(rect[3].end.x).toBe(90)
    expect(rect[3].end.y).toBe(-20)
  })
})
