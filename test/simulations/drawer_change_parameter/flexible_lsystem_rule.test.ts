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
})
