import { random } from "../../classes/utilities"
import { LSystemCondition, LSystemRule } from "./lsystem_rule"
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
    const allPossibleConditions = [...alphabets]
    const unusedConditions = new Set(allPossibleConditions)

    const loopConditions = alphabets.slice(0, random(12, 2))
    loopConditions.forEach(condition => {
      unusedConditions.delete(condition)
    })

    const branchConditions: string[] = []
    const map = new Map<string, LSystemCondition[]>()

    const randomCondition = (conditions: string[]): string => {
      const index = Math.floor(random(conditions.length))

      return conditions[index]
    }

    loopConditions.forEach((condition, index) => {
      const nextConditions: LSystemCondition[] = []
      const angle = Math.floor(random(360, 0)) - 180

      nextConditions.push(angle)
      const destinationCondition = loopConditions[(index + 1) % loopConditions.length]
      nextConditions.push(destinationCondition)

      for (let i = 0; i < 10; i += 1) {
        if (random(1) > 0.7) {
          break
        }
        const branchAngle = Math.floor(random(360, 0)) - 180
        nextConditions.push(branchAngle)

        const branchCondition = randomCondition(allPossibleConditions)
        if (unusedConditions.has(branchCondition) === true) {
          unusedConditions.delete(branchCondition)
          branchConditions.push(branchCondition)
        }
        nextConditions.push(branchCondition)
      }

      map.set(condition, nextConditions)
    })

    const usedConditions = [
      ...loopConditions,
      ...branchConditions,
    ]
    branchConditions.forEach(condition => { // 枝分かれ中にのみ登場する条件がない
      const nextConditions: LSystemCondition[] = []
      for (let i = 0; i < 10; i += 1) {
        if (random(1) > 0.5) {
          break
        }
        const angle = Math.floor(random(360, 0)) - 180
        nextConditions.push(angle)
        nextConditions.push(randomCondition(usedConditions))
      }
      if (nextConditions.length === 0) {
        nextConditions.push(VanillaLSystemRule.endOfBranch)
      }

      map.set(condition, nextConditions)
    })

    return new VanillaLSystemRule(map)
  },

  /** @throws */
  swapMutated(baseRule: LSystemRule): VanillaLSystemRule {
    const ruleMap = baseRule.mapRepresentation
    const branches = Array.from(ruleMap.keys())
    const swaps: [number, number][] = []

    const branchCount = branches.length
    if (branchCount < 3) {
      throw `Too few branches (${branchCount}), ${baseRule.encoded}`
    }

    const getSwapIndices = (): [number, number] => {
      return [Math.floor(random(branchCount)), Math.floor(random(branchCount))]
    }
    const swap = (i: number, j: number): void => {
      if (i === j) {
        return
      }
      const iKey = branches[i]
      const jKey = branches[j]
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const temp = ruleMap.get(iKey)!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ruleMap.set(iKey, ruleMap.get(jKey)!)
      ruleMap.set(jKey, temp)
    }

    const swapCount = Math.floor(random(1, Math.min(branchCount, 5)))

    for (let i = 0; i < swapCount; i += 1) {
      const [i, j] = getSwapIndices()
      swaps.push([i, j])
      swap(i, j)
    }

    const newRule = new VanillaLSystemRule(ruleMap)
    const descriptions: string[] = [
      "",
      `Base rule:\n${baseRule.encoded}\n`,
      `Swapped:\n${newRule.encoded}\n`,
      "Swap positions:",
      ...swaps.map(swap => `- ${swap[0]}: ${swap[1]}`),
      "",
    ]

    console.log(descriptions.join("\n"))

    return newRule
  },
}
