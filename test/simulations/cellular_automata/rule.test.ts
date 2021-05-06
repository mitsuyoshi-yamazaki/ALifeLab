import { SimpleMembraneRule, StateMap } from "../../../src/simulations/cellular_automata/rule"

describe("SimpleMembraneRule", () => {
  test("Instantiate", () => {
    expect(() => new SimpleMembraneRule(1)).not.toThrow()
  })

  test("Instantiate error", () => {
    expect(() => new SimpleMembraneRule(0)).toThrow()
    expect(() => new SimpleMembraneRule(-1)).toThrow()
  })

  test("Execute", () => {
    const rule = new SimpleMembraneRule(1)

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