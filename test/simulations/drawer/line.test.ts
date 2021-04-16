import { Vector } from "../../../src/classes/physics"
import { Line, LinkedLine, isCollided } from "../../../src/simulations/drawer/line"

function createLines(n: number, i?: number): LinkedLine {
  const line = new LinkedLine(Vector.zero(), Vector.zero())
  if (n <= 1) {
    return line
  }
  for (let j = 0; j < (i ?? 1); j += 1) {
    line.children.push(createLines(n - 1, i))
  }

  return line
}

describe("Number of leaves", () => {
  test("One leaf", () => {
    expect(createLines(1).numberOfLeaves).toBe(1)
    expect(createLines(2).numberOfLeaves).toBe(1)
    expect(createLines(5).numberOfLeaves).toBe(1)
  })

  test("Multiple leaves", () => {
    expect(createLines(1, 2).numberOfLeaves).toBe(1)
    expect(createLines(2, 2).numberOfLeaves).toBe(2)
    expect(createLines(3, 2).numberOfLeaves).toBe(4)
    expect(createLines(3, 3).numberOfLeaves).toBe(9)
  })
})

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
