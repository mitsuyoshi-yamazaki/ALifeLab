import { SymmetricLSystemRule } from "../../../src/simulations/drawer_symmetry/symmetric_lsystem_rule"

describe("L-System rule", () => {
  test("Invalid rule", () => {
    expect(() => new SymmetricLSystemRule("A")).toThrow()
    expect(() => new SymmetricLSystemRule("A:")).toThrow()
    expect(() => new SymmetricLSystemRule("A;B:")).toThrow()
    expect(() => new SymmetricLSystemRule("A:B:C")).toThrow()
    expect(() => new SymmetricLSystemRule("A:BC")).toThrow()
    expect(() => new SymmetricLSystemRule("A:-B")).toThrow()
    expect(() => new SymmetricLSystemRule("A:B-")).toThrow()
    // expect(() => new SymmetricLSystemRule("A:1B")).toThrow()  // TODO: 検出できないため
  })
})
