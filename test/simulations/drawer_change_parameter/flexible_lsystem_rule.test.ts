import { VanillaLSystemRule } from "../../../src/simulations/drawer/vanilla_lsystem_rule"
import { FlexibleLsystemRule } from "../../../src/simulations/drawer_change_parameter/flexible_lsystem_rule"

describe("FlexibleLsystemRule", () => {
  test("Instantiate", () => {
    const createRule = (rule: string, changes: number[]): FlexibleLsystemRule => {
      return new FlexibleLsystemRule(new VanillaLSystemRule(rule), changes, 1)
    }

    expect(() => createRule("A:0,A", [])).toThrow()
    expect(() => createRule("A:0,A", [1])).not.toThrow()
    expect(() => createRule("A:0,A", [1, 1])).toThrow()

    expect(() => createRule("A:0,A,1,A", [1])).toThrow()
    expect(() => createRule("A:0,A,1,A", [1, 1])).not.toThrow()
    expect(() => createRule("A:0,A,1,A", [1, 1, 1])).toThrow()

    expect(() => createRule("A:0,B;B:1,B", [1])).toThrow()
    expect(() => createRule("A:0,B;B:1,B", [1, 1])).not.toThrow()
    expect(() => createRule("A:0,B;B:1,B", [1, 1, 1])).toThrow()
  })

  test("Decode changes", () => {
    const decode = (changes: string) => {
      FlexibleLsystemRule.decodeChanges(changes)
    }

    expect(() => decode("")).toThrow()
    expect(() => decode("a")).toThrow()
    expect(() => decode("1")).not.toThrow()
    expect(() => decode("-1")).not.toThrow()
    expect(() => decode("12345")).not.toThrow()
    expect(() => decode("2.3")).not.toThrow()
    expect(() => decode("1,2")).not.toThrow()
    expect(() => decode("1,a,2")).toThrow()
  })

  test("Create nth rule", () => {
    const rule = new FlexibleLsystemRule(
      new VanillaLSystemRule("A:-88,A,-152,A"),
      [1, -1.5],
      180,
    )

    expect(rule.ruleOf(0).encoded).toBe("A:272,A,208,A")
    expect(rule.ruleOf(1).encoded).toBe("A:273,A,206.5,A")
    expect(rule.ruleOf(90).encoded).toBe("A:2,A,73,A")
    expect(rule.ruleOf(360).encoded).toBe("A:272,A,28,A")
    expect(rule.ruleOf(361).encoded).toBe("A:273,A,26.5,A")
  })
})
