import { Color } from "../../../src/classes/color"
import { Vector } from "../../../src/classes/physics"
import { Line, calculateLeaves } from "../../../src/simulations/drawer/object"

function createLine(n: number, i?: number): Line {
  const line = new Line(Vector.zero(), Vector.zero(), 1, Color.white())
  if (n <= 1) {
    return line
  }
  for (let j = 0; j < (i ?? 1); j += 1) {
    line.children.push(createLine(n - 1, i))
  }

  return line
}

describe("calculateLeaves", () => {
  test("One leaf", () => {
    expect(calculateLeaves(createLine(1))).toBe(1)
    expect(calculateLeaves(createLine(2))).toBe(1)
    expect(calculateLeaves(createLine(5))).toBe(1)
  })

  test("Multiple leaves", () => {
    expect(calculateLeaves(createLine(1, 2))).toBe(1)
    expect(calculateLeaves(createLine(2, 2))).toBe(2)
    expect(calculateLeaves(createLine(3, 2))).toBe(4)
    expect(calculateLeaves(createLine(3, 3))).toBe(9)
  })
})
