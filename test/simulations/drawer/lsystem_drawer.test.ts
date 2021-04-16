import { LSystemCondition, LSystemRule } from "../../../src/simulations/drawer/lsystem_drawer"

describe("L-System rule", () => {
  test("Invalid rule", () => {
    expect(() => new LSystemRule("A")).toThrow()
    expect(() => new LSystemRule("A:")).toThrow()
    expect(() => new LSystemRule("A;B:")).toThrow()
    expect(() => new LSystemRule("A:B:C")).toThrow()
    expect(() => new LSystemRule("A:BC")).toThrow()
    // expect(() => new LSystemRule("A:1B")).toThrow()  // TODO: 検出できないため
  })

  test("Decode", () => {
    const rule = new LSystemRule("A:-30,A,60,B;B:A")
    expect(rule.nextConditions("A")).toStrictEqual([-30, "A", 60, "B"])
    expect(rule.nextConditions("B")).toStrictEqual(["A"])
    expect(() => rule.nextConditions("C")).toThrow()
  })

  test("Encode", () => {
    const map = new Map<string, LSystemCondition[]>()
    map.set("A", [-30, "A", 60, "B"])
    map.set("B", ["A"])
    expect(LSystemRule.encode(map)).toBe("A:-30,A,60,B;B:A")
  })
})
