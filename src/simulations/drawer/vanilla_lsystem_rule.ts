import { Color } from "../../classes/color"
import { LSystemRule, LSystemCondition, LSystemCoordinate } from "./lsystem_rule"

export type LSystemStateLoop = string

const niceColors: Color[] = [
  new Color(51, 127, 214),
  new Color(182, 11, 145),
  new Color(27, 45, 108),
  new Color(128, 57, 241),
  new Color(39, 86, 26),
  new Color(217, 76, 62),
  new Color(92, 115, 151),
  new Color(172, 84, 60),
]

export class LSystemStateTransition {
  public readonly maxLoopLength: number

  private readonly colors = new Map<LSystemStateLoop, Color>()

  public constructor(public readonly loops: LSystemStateLoop[]) {
    this.maxLoopLength = Math.max(...loops.map(l => l.length))
    for (let i = 0; i < loops.length; i += 1) {
      const loop = loops[i]
      if (i >= niceColors.length) {
        console.log("色が足りない")
        this.colors.set(loop, Color.random())
      } else {
        this.colors.set(loop, niceColors[i])
      }
    }
  }
  
  public colorOf(loop: LSystemStateLoop): Color {
    return this.colors.get(loop) ?? Color.white(0x0)
  }
}

export class VanillaLSystemRule implements LSystemRule {
  public static initialCondition = "A"

  public readonly transition: LSystemStateTransition

  public get possibleConditions(): string[] {
    return Array.from(this._map.keys())
  }
  public get encoded(): string {
    return this._encoded
  }
  public get mapRepresentation(): Map<string, LSystemCondition[]> {
    return new Map(this._map)
  }

  public static endOfBranch = "."
  
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
  /** @throws */
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
    this.transition = this.calculateTransition()
  }

  public static encode(map: Map<string, LSystemCondition[]>): string {
    const result: string[] = []
    map.forEach((value, key) => {
      const nextCondition = value.map(v => `${v}`).join(",")
      result.push(`${key}:${nextCondition}`)
    })

    return result.join(";")
  }

  /** @throws */
  public static decode(encoded: string): Map<string, LSystemCondition[]> {
    const map = new Map<string, LSystemCondition[]>()
    encoded.split(";").forEach(pair => {
      const keyValue = pair.split(":")
      if (keyValue.length !== 2) {
        throw new Error(`Invalid condition: next-condition pair ${pair}`)
      }
      const condition = keyValue[0]
      const nextConditions = keyValue[1].split(",").map((stringValue: string): LSystemCondition => {
        const numberValue = parseFloat(stringValue)
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

  public encodedWith(encoder: ((condition: LSystemCondition) => string)): string {
    const conditionMapper = (condition: LSystemCondition): string => {
      if (typeof condition === "string") {
        return condition
      } else {
        return encoder(condition)
      }
    }

    const result: string[] = []
    this._map.forEach((value, key) => {
      const nextCondition = value.map(conditionMapper).join(",")
      result.push(`${key}:${nextCondition}`)
    })

    return result.join(";")
  }

  public nextConditions(currentCondition: string): LSystemCondition[] {
    const nextConditions = this._map.get(currentCondition)
    if (nextConditions == null) {
      if (currentCondition === VanillaLSystemRule.endOfBranch) {
        return []
      }

      throw new Error(`Invalid condition "${currentCondition}" (rule: ${this.encoded})`)
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

  public loopOf(condition: string, conditionHistory: string, loopCount: number): LSystemStateLoop | null {
    if (loopCount < 2) {
      throw new Error(`2未満のloopCountではループを検出できません. loopCount: ${loopCount}`)
    }
    const historyArray = conditionHistory.split("")
    const reversedIndex = historyArray.reverse().indexOf(condition)
    if (reversedIndex < 0) {
      return null
    }
    const index = conditionHistory.length - reversedIndex - 1
    const lastLoop = conditionHistory.slice(index)
    for (let i = 1; i < loopCount; i += 1) {
      const startIndex = index - (lastLoop.length * i)
      const endIndex = startIndex + lastLoop.length
      if (startIndex < 0) {
        return null
      }
      const loop = conditionHistory.slice(startIndex, endIndex)
      if (loop !== lastLoop) {
        return null
      }
    }

    const possiblePatterns = possibleLoopPatterns(lastLoop)
    for (let i = 0; i < possiblePatterns.length; i += 1) {
      const pattern = possiblePatterns[i]
      if (this.transition.loops.includes(pattern)) {
        return pattern
      }
    }
    // TODO: 「状態遷移の切り替わり」がループしている状態を検出できるようにする
    return null
  }

  /*
   * 複数の状態遷移をもつ場合、状態遷移ごとに分割したルールを返す
   */
  private calculateTransition(): LSystemStateTransition {
    const initialCondition = VanillaLSystemRule.initialCondition

    const check = (condition: string, transition: string): LSystemStateLoop[] => {
      const currentTransition = transition + condition
      const nextConditions: string[] = (this._map.get(condition) ?? []).filter(c => typeof c === "string") as string[]
      const transitions: LSystemStateLoop[] = []
      const checked: string[] = []

      nextConditions.forEach(c => {
        if (checked.includes(c)) {
          return
        }
        checked.push(c)
        const index = currentTransition.indexOf(c)
        if (index >= 0) {
          transitions.push(currentTransition.slice(index))
          return
        }

        transitions.push(...check(c, currentTransition))
      })
      return transitions
    }

    const filterDuplicate = (transitions: LSystemStateLoop[]): LSystemStateLoop[] => {
      const allPossibleLoops: string[] = []
      const r = transitions.filter(loop => {
        if (allPossibleLoops.includes(loop)) {
          return false
        }
        allPossibleLoops.push(...possibleLoopPatterns(loop))
        return true
      })
      return r
    }

    return new LSystemStateTransition(filterDuplicate(check(initialCondition, "")))
  }
}

export function possibleLoopPatterns(original: string): string[] {
  const patterns: string[] = []
  for (let i = 0; i < original.length; i += 1) {
    patterns.push(original.slice(i).concat(original.slice(0, i)))
  }
  return patterns
}