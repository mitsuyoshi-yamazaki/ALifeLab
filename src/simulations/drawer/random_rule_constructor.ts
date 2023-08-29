import { random } from "../../classes/utilities"
import { LSystemCondition } from "./lsystem_rule"
import { VanillaLSystemRule } from "./vanilla_lsystem_rule"

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export const RandomRuleConstructor = {
  random(): VanillaLSystemRule {
    const conditions = alphabets.slice(0, random(alphabets.length, 1))
    const map = new Map<string, LSystemCondition[]>()
    const maxConditions = 10

    const randomCondition = (): string => {
      const index = Math.floor(random(conditions.length))

      return conditions[index]
    }

    conditions.forEach(condition => {
      const nextConditions: LSystemCondition[] = []
      for (let i = 0; i < maxConditions; i += 1) {
        if (random(1) > 0.5) {
          break
        }
        const angle = Math.floor(random(360, 0)) - 180
        nextConditions.push(angle)
        nextConditions.push(randomCondition())
      }
      if (nextConditions.length === 0) {
        nextConditions.push(VanillaLSystemRule.endOfBranch)
      }

      map.set(condition, nextConditions)
    })

    return new VanillaLSystemRule(map)  // TODO: 死枝の除外等もこの処理の中に移す
  },

  graph(): VanillaLSystemRule {
    const conditions = alphabets.slice(0, random(alphabets.length, 1))
    const map = new Map<string, LSystemCondition[]>()

    conditions.forEach((condition, index) => {
      const nextConditions: LSystemCondition[] = []
      const angle = Math.floor(random(360, 0)) - 180
      nextConditions.push(angle)

      nextConditions.push(angle)
      const destinationCondition = conditions[(index + 1) % conditions.length]
      nextConditions.push(destinationCondition)

      map.set(condition, nextConditions)
    })

    return new VanillaLSystemRule(map)
  },
}