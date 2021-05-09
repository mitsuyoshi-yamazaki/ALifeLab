import { Vector } from "../../../src/classes/physics"
import { Field } from "../../../src/simulations/cellular_automata/field"
import { State } from "../../../src/simulations/cellular_automata/rule"

describe("Initialize", () => {
  test("State - one", () => {
    const field = Field.create(new Vector(3, 3), "one", 2)

    expect(field.states[0][0]).toBe(0)
    expect(field.states[1][0]).toBe(0)
    expect(field.states[2][0]).toBe(0)
    expect(field.states[0][1]).toBe(0)
    expect(field.states[1][1]).toBe(1)
    expect(field.states[2][1]).toBe(0)
    expect(field.states[0][2]).toBe(0)
    expect(field.states[1][2]).toBe(0)
    expect(field.states[2][2]).toBe(0)
  })

  test("State - line", () => {
    const field = Field.create(new Vector(3, 3), "line", 2)

    expect(field.states[0][0]).toBe(0)
    expect(field.states[1][0]).toBe(1)
    expect(field.states[2][0]).toBe(0)
    expect(field.states[0][1]).toBe(0)
    expect(field.states[1][1]).toBe(1)
    expect(field.states[2][1]).toBe(0)
    expect(field.states[0][2]).toBe(0)
    expect(field.states[1][2]).toBe(1)
    expect(field.states[2][2]).toBe(0)
  })
})

describe("Neighbour State", () => {
  test("Radius1", () => {
    const radius = 1
    const states: State[][] = [
      [0, 1, 0],
      [1, 0, 0],
      [1, 0, 1],
    ]
    const field = new Field(states)

    expect(field.stateCounts(0, 0, radius, null).stateCount(0)).toBe(3)
    expect(field.stateCounts(0, 0, radius, null).stateCount(1)).toBe(3)
    expect(field.stateCounts(1, 0, radius, null).stateCount(0)).toBe(5)
    expect(field.stateCounts(1, 0, radius, null).stateCount(1)).toBe(1)
    expect(field.stateCounts(2, 0, radius, null).stateCount(0)).toBe(2)
    expect(field.stateCounts(2, 0, radius, null).stateCount(1)).toBe(4)

    expect(field.stateCounts(0, 1, radius, null).stateCount(0)).toBe(4)
    expect(field.stateCounts(0, 1, radius, null).stateCount(1)).toBe(2)
    expect(field.stateCounts(1, 1, radius, null).stateCount(0)).toBe(3)
    expect(field.stateCounts(1, 1, radius, null).stateCount(1)).toBe(3)
    expect(field.stateCounts(2, 1, radius, null).stateCount(0)).toBe(3)
    expect(field.stateCounts(2, 1, radius, null).stateCount(1)).toBe(3)

    expect(field.stateCounts(0, 2, radius, null).stateCount(0)).toBe(3)
    expect(field.stateCounts(0, 2, radius, null).stateCount(1)).toBe(3)
    expect(field.stateCounts(1, 2, radius, null).stateCount(0)).toBe(3)
    expect(field.stateCounts(1, 2, radius, null).stateCount(1)).toBe(3)
    expect(field.stateCounts(2, 2, radius, null).stateCount(0)).toBe(4)
    expect(field.stateCounts(2, 2, radius, null).stateCount(1)).toBe(2)
  })

  test("Radius2-1", () => {
    const radius = 2
    const states: State[][] = [
      [0, 1, 0],
      [1, 0, 0],
      [1, 0, 1],
    ]
    const field = new Field(states)

    expect(field.stateCounts(0, 0, radius, null).stateCount(0)).toBe(9)
    expect(field.stateCounts(0, 0, radius, null).stateCount(1)).toBe(9)
    expect(field.stateCounts(1, 0, radius, null).stateCount(0)).toBe(10)
    expect(field.stateCounts(1, 0, radius, null).stateCount(1)).toBe(8)
    expect(field.stateCounts(2, 0, radius, null).stateCount(0)).toBe(10)
    expect(field.stateCounts(2, 0, radius, null).stateCount(1)).toBe(8)

    expect(field.stateCounts(0, 1, radius, null).stateCount(0)).toBe(11)
    expect(field.stateCounts(0, 1, radius, null).stateCount(1)).toBe(7)
    expect(field.stateCounts(1, 1, radius, null).stateCount(0)).toBe(9)
    expect(field.stateCounts(1, 1, radius, null).stateCount(1)).toBe(9)
    expect(field.stateCounts(2, 1, radius, null).stateCount(0)).toBe(9)
    expect(field.stateCounts(2, 1, radius, null).stateCount(1)).toBe(9)

    expect(field.stateCounts(0, 2, radius, null).stateCount(0)).toBe(12)
    expect(field.stateCounts(0, 2, radius, null).stateCount(1)).toBe(6)
    expect(field.stateCounts(1, 2, radius, null).stateCount(0)).toBe(9)
    expect(field.stateCounts(1, 2, radius, null).stateCount(1)).toBe(9)
    expect(field.stateCounts(2, 2, radius, null).stateCount(0)).toBe(11)
    expect(field.stateCounts(2, 2, radius, null).stateCount(1)).toBe(7)
  })

  test("Radius2-2", () => {
    const radius = 2
    const states: State[][] = [ // length = 11
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],  // center
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    const field = new Field(states)

    expect(field.stateCounts(4, 4, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(5, 4, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(6, 4, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(4, 5, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(5, 5, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(6, 5, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(4, 6, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(5, 6, radius, null).stateCount(0)).toBe(18)
    expect(field.stateCounts(6, 6, radius, null).stateCount(0)).toBe(18)

    for (let y = 0; y < 11; y += 1) {
      for (let x = 0; x < 11; x += 1) {
        if ((x >= 4 && x <= 6) && (y >= 4 && y <= 6)) {
          continue
        }
        // console.log(`(${x}, ${y})`)
        expect(field.stateCounts(x, y, radius, null).stateCount(0)).not.toBe(18)
      }
    }
  })
})
