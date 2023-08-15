import { random } from "../../classes/utilities"
import { LSystemCondition } from "./lsystem_rule"
import { VanillaLSystemRule } from "./vanilla_lsystem_rule"

export const RandomRuleConstructor = {
  random(): VanillaLSystemRule {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
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

    return new VanillaLSystemRule(map)
  } 
}