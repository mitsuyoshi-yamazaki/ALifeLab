import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"

export class FlexibleLsystemRule {
  public constructor(
    public readonly rule: VanillaLSystemRule,
    public readonly changes: number[],
    public readonly period: number,
  ) {
    if (this.canEncode() === false) {
      throw new Error(`Number of numbers in rule ${rule.encoded} not match to changes ${changes}`)
    }
  }

  public static decodeChanges(changes: string): number[] {
    const result = changes.split(",").map(n => parseFloat(n))
    if (result.length <= 0) {
      throw new Error(`Empty changes: ${changes}`)
    }
    if (result.some(n => isNaN(n))) {
      throw new Error(`Can't parse changes: ${changes}`)
    }
    return result
  }

  // n th rule
  public ruleOf(n: number): VanillaLSystemRule {
    const changes = this.changes.concat([]).reverse()
    const rule = this.rule.encodedWith(condition => {
      if (typeof condition === "string") {
        return condition
      } else {
        const change = changes.pop()
        if (change === undefined) {
          throw new Error(`Unexpectedly lack of changes: ${this.changes}`)
        }
        const addition = change * n
        return `${(condition + addition + 720) % 360}`
      }
    })
    return new VanillaLSystemRule(rule)
  }

  private canEncode(): boolean {
    let changesCount = this.changes.length
    this.rule.encodedWith(condition => {
      changesCount -= 1
      return `${condition}`
    })
    return changesCount === 0
  }
}
