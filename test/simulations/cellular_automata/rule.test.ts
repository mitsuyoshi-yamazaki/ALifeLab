import { SimpleMembraneRule } from "../../../src/simulations/cellular_automata/rule"

describe("SimpleMembraneRule", () => {
  test("Instantiate", () => {
    expect(() => new SimpleMembraneRule(1)).not.toThrow()
  })

  test("Instantiate error", () => {
    expect(() => new SimpleMembraneRule(0)).toThrow()
    expect(() => new SimpleMembraneRule(-1)).toThrow()
  })
})