import { LSystemCondition, LSystemRule } from "../../../src/simulations/drawer/lsystem_rule"

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

  test("Trim unreachiable conditions", () => {
    const trimmed = (originalRule: string, initialCondition: string): string => {
      const rule = new LSystemRule(originalRule)
      return LSystemRule.trimUnreachableConditions(rule, initialCondition).encoded
    }

    const immutableRule1 = "A:A"
    const immutableRule2 = "A:1,A,-1,B;B:C,D;C:A;D:."
    const immutableRule3 = "A:."
    const mutableRule1 = "A:A;B:B"
    const mutableRule2 = "A:1,A,-1,B;B:C,D;C:A;D:.;E:1,F,-1,G;F:.;G:E"
    const mutableRule3 = "A:.;B:B;C:."

    expect(trimmed(immutableRule1, "A")).toBe(immutableRule1)
    expect(trimmed(immutableRule2, "A")).toBe(immutableRule2)
    expect(trimmed(immutableRule3, "A")).toBe(immutableRule3)
    expect(trimmed(mutableRule1, "A")).toBe(immutableRule1)
    expect(trimmed(mutableRule2, "A")).toBe(immutableRule2)
    expect(trimmed(mutableRule3, "A")).toBe(immutableRule3)
  })

  test("Circulated rule", () => {
    const isCirculated = (rule: string, initialCondition: string): boolean => {
      return new LSystemRule(rule).isCirculated(initialCondition)
    }

    const circulatedRule1 = "A:A"
    const circulatedRule2 = "A:B;B:B"
    const circulatedRule3 = "A:B;B:B,C;C:."
    const nonCirculatedRule1 = "A:."
    const nonCirculatedRule2 = "A:B;B:."
    const nonCirculatedRule3 = "A:B;B:.;C:C"

    expect(isCirculated(circulatedRule1, "A")).toBe(true)
    expect(isCirculated(circulatedRule2, "A")).toBe(true)
    expect(isCirculated(circulatedRule3, "A")).toBe(true)
    expect(isCirculated(circulatedRule3, "B")).toBe(true)
    expect(isCirculated(circulatedRule3, "C")).toBe(false)
    expect(isCirculated(nonCirculatedRule1, "A")).toBe(false)
    expect(isCirculated(nonCirculatedRule2, "A")).toBe(false)
    expect(isCirculated(nonCirculatedRule3, "A")).toBe(false)
    expect(isCirculated(nonCirculatedRule3, "C")).toBe(true)
  })
})
