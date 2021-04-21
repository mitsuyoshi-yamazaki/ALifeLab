import { random } from "../../classes/utilities"

export type SymmetricLSystemCondition = string | number

export class SymmetricLSystemRule {
  public static initialCondition = "A"

  public get possibleConditions(): string[] {
    return Array.from(this._map.keys())
  }

  public get encoded(): string {
    return this._encoded
  }

  private static endOfBranch = "."
  private static pushCode = "("
  private static popCode = ")"
  private static modifiers = [
    SymmetricLSystemRule.endOfBranch,
    SymmetricLSystemRule.pushCode,
    SymmetricLSystemRule.popCode,
  ]
  private _encoded: string
  private _map: Map<string, SymmetricLSystemCondition[]>

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
  public constructor(map: Map<string, SymmetricLSystemCondition[]>);
  public constructor(first: string | Map<string, SymmetricLSystemCondition[]>) {
    if (typeof (first) === "string") {
      this._encoded = first
      this._map = SymmetricLSystemRule.decode(first)
    } else {
      this._encoded = SymmetricLSystemRule.encode(first)
      this._map = first
    }
  }

  // TODO: push/pop対応
  public static random(): SymmetricLSystemRule { // FixMe: 適当に書いたので探索範囲が偏っているはず
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const conditions = alphabets.slice(0, random(alphabets.length, 1))
    const map = new Map<string, SymmetricLSystemCondition[]>()
    const maxConditions = 10

    const randomCondition = (): string => {
      const index = Math.floor(random(conditions.length))

      return conditions[index]
    }

    conditions.forEach(condition => {
      const nextConditions: SymmetricLSystemCondition[] = []
      for (let i = 0; i < maxConditions; i += 1) {
        if (random(1) > 0.5) {
          break
        }
        const angle = Math.floor(random(360, 0)) - 180
        nextConditions.push(angle)
        nextConditions.push(randomCondition())
      }
      if (nextConditions.length === 0) {
        nextConditions.push(SymmetricLSystemRule.endOfBranch)
      }

      map.set(condition, nextConditions)
    })

    return new SymmetricLSystemRule(map)
  }

  public static encode(map: Map<string, SymmetricLSystemCondition[]>): string {
    const result: string[] = []
    map.forEach((value, key) => {
      const nextCondition = value.map(v => `${v}`).join(",")
      result.push(`${key}:${nextCondition}`)
    })

    return result.join(";")
  }

  public static decode(encoded: string): Map<string, SymmetricLSystemCondition[]> {
    const map = new Map<string, SymmetricLSystemCondition[]>()
    encoded.split(";").forEach(pair => {
      const keyValue = pair.split(":")
      if (keyValue.length !== 2) {
        throw new Error(`Invalid condition: next-condition pair ${pair}`)
      }
      const condition = keyValue[0]
      const nextConditions = keyValue[1].split(",").map((stringValue: string): SymmetricLSystemCondition => {
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

  // // Same as optimize_rule.py
  // public static trimUnreachableConditions(rule: SymmetricLSystemRule, initialCondition: string): SymmetricLSystemRule {
  //   const trimmedRule = new Map<string, SymmetricLSystemCondition[]>()
  //   let conditionsToCheck = [initialCondition]
  //   while (conditionsToCheck.length > 0) {
  //     const additionalConditions: string[] = []
  //     conditionsToCheck.forEach(condition => {
  //       const nextConditions = rule.nextConditions(condition)
  //       trimmedRule.set(condition, nextConditions)
  //       nextConditions.forEach(nextCondition => {
  //         if (typeof (nextCondition) !== "string") {
  //           return
  //         }
  //         if (nextCondition === SymmetricLSystemRule.endOfBranch) {
  //           return
  //         }
  //         if (additionalConditions.includes(nextCondition)) {
  //           return
  //         }
  //         if (Array.from(trimmedRule.keys()).includes(nextCondition)) {
  //           return
  //         }
  //         additionalConditions.push(nextCondition)
  //       })
  //     })
  //     conditionsToCheck = additionalConditions
  //   }
  //   return new SymmetricLSystemRule(trimmedRule)
  // }

  public nextConditions(currentCondition: string): SymmetricLSystemCondition[] {
    const nextConditions = this._map.get(currentCondition)
    if (nextConditions == null) {
      if (currentCondition === SymmetricLSystemRule.endOfBranch) {
        return []
      }

      throw new Error(`Invalid condition ${currentCondition} (rule: ${this.encoded})`)
    }

    return nextConditions
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
          if (SymmetricLSystemRule.modifiers.includes(nextCondition)) {
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