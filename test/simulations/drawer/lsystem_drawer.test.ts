import { LSystemRule } from "../../../src/simulations/drawer/lsystem_drawer"

describe("L-System rule", () => {
  test("Invalid rule", () => {
    expect(() => new LSystemRule("A")).toThrow()
    expect(() => new LSystemRule("A:")).toThrow()
    expect(() => new LSystemRule("A;B:")).toThrow()
    expect(() => new LSystemRule("A:B:C")).toThrow()
  })

  test("Next conditions", () => {
    const rule = new LSystemRule("A:-30,A,60,B;B:A")
    expect(rule.nextConditions("A")).toStrictEqual([-30, "A", 60, "B"])
    expect(rule.nextConditions("B")).toStrictEqual(["A"])
    expect(() => rule.nextConditions("C")).toThrow()
  })
})
