import { BinaryColorPalette } from "../../../src/simulations/cellular_automata/color_palette"
import { StateMap } from "../../../src/simulations/cellular_automata/rule"
import { SimpleBubbleRule } from "../../../src/simulations/cellular_automata/rules/simple_bubble_rule"

const colorPalette = new BinaryColorPalette()

describe("SimpleBubbleRule", () => {
  test("Instantiate", () => {
    expect(() => new SimpleBubbleRule(1, colorPalette)).not.toThrow()
  })

  test("Instantiate error", () => {
    expect(() => new SimpleBubbleRule(0, colorPalette)).toThrow()
    expect(() => new SimpleBubbleRule(-1, colorPalette)).toThrow()
  })

  test("Execute", () => {
    const rule = new SimpleBubbleRule(1, colorPalette)

    const stateMap1 = new StateMap()
    stateMap1.increment(0, 4)
    stateMap1.increment(1, 2)
    expect(rule.nextState(0, stateMap1)).toBe(0)
    expect(rule.nextState(1, stateMap1)).toBe(0)

    const stateMap2 = new StateMap()
    stateMap2.increment(0, 2)
    stateMap2.increment(1, 4)
    expect(rule.nextState(0, stateMap2)).toBe(1)
    expect(rule.nextState(1, stateMap2)).toBe(1)

    const stateMap3 = new StateMap()
    stateMap3.increment(0, 3)
    stateMap3.increment(1, 3)
    expect(rule.nextState(0, stateMap3)).toBe(0)
    expect(rule.nextState(1, stateMap3)).toBe(1)
  })
})