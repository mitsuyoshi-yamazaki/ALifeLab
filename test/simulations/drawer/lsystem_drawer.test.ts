import { LSystemCondition } from "../../../src/simulations/drawer/lsystem_rule"
import {
  VanillaLSystemRule,
  LSystemStateTransition,
  possibleLoopPatterns
} from "../../../src/simulations/drawer/vanilla_lsystem_rule"

describe("L-System rule", () => {
  test("Invalid rule", () => {
    expect(() => new VanillaLSystemRule("A")).toThrow()
    expect(() => new VanillaLSystemRule("A:")).toThrow()
    expect(() => new VanillaLSystemRule("A;B:")).toThrow()
    expect(() => new VanillaLSystemRule("A:B:C")).toThrow()
    expect(() => new VanillaLSystemRule("A:BC")).toThrow()
    // expect(() => new VanillaLSystemRule("A:1B")).toThrow()  // TODO: 検出できないため
  })

  test("Decode", () => {
    const rule = new VanillaLSystemRule("A:-30,A,60,B;B:A")
    expect(rule.nextConditions("A")).toStrictEqual([-30, "A", 60, "B"])
    expect(rule.nextConditions("B")).toStrictEqual(["A"])
    expect(() => rule.nextConditions("C")).toThrow()
  })

  test("Encode", () => {
    const map = new Map<string, LSystemCondition[]>()
    map.set("A", [-30, "A", 60, "B"])
    map.set("B", ["A"])
    expect(VanillaLSystemRule.encode(map)).toBe("A:-30,A,60,B;B:A")
  })

  test("Trim unreachiable conditions", () => {
    const trimmed = (originalRule: string, initialCondition: string): string => {
      const rule = new VanillaLSystemRule(originalRule)
      return VanillaLSystemRule.trimUnreachableConditions(rule, initialCondition).encoded
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
      return new VanillaLSystemRule(rule).isCirculated(initialCondition)
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

  test("Possible loop patterns", () => {
    expect(possibleLoopPatterns("ABCDE").sort()).toStrictEqual([
      "ABCDE",
      "BCDEA",
      "CDEAB",
      "DEABC",
      "EABCD",
    ].sort())
  })

  test("State transition loop", () => {
    const transitionsOf = (rule: string): LSystemStateTransition => {
      return new VanillaLSystemRule(rule).transition
    }

    // ヒトデ3
    const transition1 = transitionsOf("A:-64,C,120,A;C:125,B;B:-122,C,155,A")
    expect(transition1.loops.sort()).toStrictEqual([
      "A",
      "ACB",
      "CB",
    ].sort())
    expect(transition1.maxLoopLength).toBe(3)

    // 星
    const transition2 = transitionsOf("A:-142,D;C:.;D:-31,S,-117,I;I:-99,J,-95,C;H:20,L,-30,A,90,H,-50,M,-27,H;J:.;M:.;L:.;S:135,H")
    expect(transition2.loops.sort()).toStrictEqual([
      "ADSH",
      "H",
    ].sort())
    expect(transition2.maxLoopLength).toBe(4)

    // ウミウシ
    const transition3 = transitionsOf("A:175,B,-114,A,41,B,132,D,-54,F;B:12,D,-63,C,62,F,-32,D,-144,C,101,C;C:51,A;D:133,A;E:143,A,-44,E;F:-112,B,5,A,82,B")
    expect(transition3.loops.sort()).toStrictEqual([
      "A",
      "ABC",
      "ABD",
      "AD",
      "ABF",
      "BF",
      "AF",
      "AFBC",
      "AFBD",
    ].sort())
    expect(transition3.maxLoopLength).toBe(4)
  })

  test("State transition loop detection", () => {
    // ルールのtransition.loopsはState transition loopテストを参照

    // ヒトデ3
    const rule = new VanillaLSystemRule("A:-64,C,120,A;C:125,B;B:-122,C,155,A")
    expect(() => rule.loopOf("A", "A", 1)).toThrow()
    expect(rule.loopOf("A", "AA", 2)).toBe("A")
    expect(rule.loopOf("A", "AAA", 2)).toBe("A")
    expect(rule.loopOf("A", "AA", 3)).toBeNull()
    expect(rule.loopOf("A", "", 2)).toBeNull()
    expect(rule.loopOf("A", "ABA", 2)).toBeNull()
    expect(rule.loopOf("C", "CBCB", 2)).toBe("CB")
    expect(rule.loopOf("B", "BCBC", 2)).toBe("CB")
    expect(rule.loopOf("C", "CBCBCB", 2)).toBe("CB")
    expect(rule.loopOf("C", "BCB", 2)).toBeNull()
    expect(rule.loopOf("C", "CBCBCB", 3)).toBe("CB")
    expect(rule.loopOf("A", "ACBACB", 2)).toBe("ACB")
    expect(rule.loopOf("C", "CBACBA", 2)).toBe("ACB")
    expect(rule.loopOf("B", "BACBAC", 2)).toBe("ACB")
    expect(rule.loopOf("C", "ACBACB", 2)).toBeNull()
    expect(rule.loopOf("B", "ACBACB", 2)).toBeNull()
  })
})
