import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"

export class FlexibleLsystemRule {
  public constructor(
    public readonly rule: VanillaLSystemRule,
    public readonly changes: number[],
  ) {
    if (this.canEncode() === false) {
      throw new Error(`Number of numbers in rule ${rule.encoded} not match to changes ${changes}`)
    }
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