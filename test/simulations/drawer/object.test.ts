import { Vector } from "../../../src/classes/physics"
import { Line } from "../../../src/simulations/drawer/object"

function createLine(n: number, i?: number): Line {
  const line = new Line(Vector.zero(), Vector.zero())
  if (n <= 1) {
    return line
  }
  for (let j = 0; j < (i ?? 1); j += 1) {
    line.children.push(createLine(n - 1, i))
  }

  return line
}

describe("Number of leaves", () => {
  test("One leaf", () => {
    expect(createLine(1).numberOfLeaves).toBe(1)
    expect(createLine(2).numberOfLeaves).toBe(1)
    expect(createLine(5).numberOfLeaves).toBe(1)
  })

  test("Multiple leaves", () => {
    expect(createLine(1, 2).numberOfLeaves).toBe(1)
    expect(createLine(2, 2).numberOfLeaves).toBe(2)
    expect(createLine(3, 2).numberOfLeaves).toBe(4)
    expect(createLine(3, 3).numberOfLeaves).toBe(9)
  })
})
