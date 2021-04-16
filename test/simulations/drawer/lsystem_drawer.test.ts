import { LSystemRule } from "../../../src/simulations/drawer/lsystem_drawer"

describe("L-System rule", () => {
  test("Decode pattern", () => {
    const rule = new LSystemRule("A:-30,A,60,B&B:A")
    expect(rule.nextConditions("A")).toStrictEqual([-30, "A", 60, "B"])
    expect(rule.nextConditions("B")).toStrictEqual(["A"])
    expect(() => rule.nextConditions("C")).toThrow()
  })
})
