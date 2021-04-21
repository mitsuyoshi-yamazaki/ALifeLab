import { random } from "../../classes/utilities"
import { LSystemRule, LSystemCondition, LSystemCoordinate } from "./lsystem_rule"

export class VanillaLSystemRule implements LSystemRule {
  public static initialCondition = "A"

  public get possibleConditions(): string[] {
    return Array.from(this._map.keys())
  }

  public get encoded(): string {
    return this._encoded
  }

  private static endOfBranch = "."
  private _encoded: string
  private _map: Map<string, LSystemCondition[]>

  /*
   * Encoding:
     * <condition>:<next conditions>;<condition>:<next conditions>,...
       * condition: string
       * next condition: list of string | number
       * special condition . has no next condition
   * Example:
     * A:-30,A,60,B;B:A
   */
  public constructor(encoded: string);
  public constructor(map: Map<string, LSystemCondition[]>);
  public constructor(first: string | Map<string, LSystemCondition[]>) {
    if (typeof (first) === "string") {
      this._encoded = first
      this._map = VanillaLSystemRule.decode(first)
    } else {
      this._encoded = VanillaLSystemRule.encode(first)
      this._map = first
    }
  }

  public static random(): VanillaLSystemRule { // FixMe: 適当に書いたので探索範囲が偏っているはず
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

  public static encode(map: Map<string, LSystemCondition[]>): string {
    const result: string[] = []
    map.forEach((value, key) => {
      const nextCondition = value.map(v => `${v}`).join(",")
      result.push(`${key}:${nextCondition}`)
    })

    return result.join(";")
  }

  public static decode(encoded: string): Map<string, LSystemCondition[]> {
    const map = new Map<string, LSystemCondition[]>()
    encoded.split(";").forEach(pair => {
      const keyValue = pair.split(":")
      if (keyValue.length !== 2) {
        throw new Error(`Invalid condition: next-condition pair ${pair}`)
      }
      const condition = keyValue[0]
      const nextConditions = keyValue[1].split(",").map((stringValue: string): LSystemCondition => {
        const numberValue = parseInt(stringValue, 10)
        if (isNaN(numberValue) === true) {
          if (stringValue.length <= 0) {
            throw new Error(`Invalid condition: empty string ${pair}`)
          } else if (stringValue.length > 1) {
            throw new Error(`Invalid condition: multiple characters ${pair}`)
          }

          return stringValue
        }

        return numberValue
      })

      map.set(condition, nextConditions)
    })

    return map
  }

  // Same as optimize_rule.py
  public static trimUnreachableConditions(rule: VanillaLSystemRule, initialCondition: string): VanillaLSystemRule {
    const trimmedRule = new Map<string, LSystemCondition[]>()
    let conditionsToCheck = [initialCondition]
    while (conditionsToCheck.length > 0) {
      const additionalConditions: string[] = []
      conditionsToCheck.forEach(condition => {
        const nextConditions = rule.nextConditions(condition)
        trimmedRule.set(condition, nextConditions)
        nextConditions.forEach(nextCondition => {
          if (typeof(nextCondition) !== "string") {
            return
          }
          if (nextCondition === VanillaLSystemRule.endOfBranch) {
            return
          }
          if (additionalConditions.includes(nextCondition)) {
            return
          }
          if (Array.from(trimmedRule.keys()).includes(nextCondition)) {
            return
          }
          additionalConditions.push(nextCondition)
        })
      })
      conditionsToCheck = additionalConditions
    }
    return new VanillaLSystemRule(trimmedRule)
  }

  public nextConditions(currentCondition: string): LSystemCondition[] {
    const nextConditions = this._map.get(currentCondition)
    if (nextConditions == null) {
      if (currentCondition === VanillaLSystemRule.endOfBranch) {
        return []
      }

      throw new Error(`Invalid condition ${currentCondition} (rule: ${this.encoded})`)
    }

    return nextConditions
  }

  public nextCoordinates(condition: string, direction: number): LSystemCoordinate[] {
    let newDirection = direction
    const nextConditions = this.nextConditions(condition)
    const nextCoordinates: LSystemCoordinate[] = []

    for (const condition of nextConditions) {
      if (typeof (condition) === "number") {
        newDirection += condition
        continue
      }

      nextCoordinates.push({
        condition: condition,
        direction: newDirection,
      })
    }
    return nextCoordinates
  }

  // A:A -> true
  // A:B;B:B -> true
  // A:B;B:. -> false
  public isCirculated(initialCondition: string): boolean {
    let isCirculated = false
    const checked: string[] = []
    let conditionsToCheck: string[] = [initialCondition]
    
    while (isCirculated === false && conditionsToCheck.length > 0) {
      conditionsToCheck = conditionsToCheck.flatMap(condition => {
        checked.push(condition)
        return this.nextConditions(condition).filter(nextCondition => {
          if (typeof (nextCondition) !== "string") {
            return false
          }
          if (nextCondition === VanillaLSystemRule.endOfBranch) {
            return false
          }
          if (checked.includes(nextCondition)) {
            isCirculated = true
            return false
          }
          return true
        }) as string[]
      })
    }

    return isCirculated
  }
}