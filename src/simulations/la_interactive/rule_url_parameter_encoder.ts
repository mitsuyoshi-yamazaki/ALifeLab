import { Result } from "../../classes/result"
import { Vector } from "../../classes/physics"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"

export type CodableRuleInfo = {
  readonly rule: VanillaLSystemRule
  readonly position: Vector
  readonly angle: number
  readonly lineCount: number
}

const separator = ";;"
const numberOfRuleComponents = 5
const defaultDecodeFailureReason = "ルールを読み込めません"

/**
 * <x>;;<y>;;<angle>;;<line count>;;<rule>;;<x>;;<y>;;...
 */
export function encodeRules(ruleInfo: CodableRuleInfo[]): string {
  return ruleInfo
    .map(info => {
      const components: string[] = []
      components.push(`${info.position.x}`)
      components.push(`${info.position.y}`)
      components.push(`${info.angle}`)
      components.push(`${info.lineCount}`)
      components.push(`${info.rule.encoded}`)
      return components.join(separator)
    })
    .join(separator)
}

export function decodeRules(text: string): Result<CodableRuleInfo[], string> {
  const decodedRules: CodableRuleInfo[] = []

  const components = text.split(separator)
  if (components.length % numberOfRuleComponents !== 0) {
    return Result.Failed(defaultDecodeFailureReason)
  }
  const numberOfRules = Math.floor(components.length / numberOfRuleComponents)
  for (let i = 0; i < numberOfRules; i += 1) {
    const ruleComponents = components.splice(0, numberOfRuleComponents)
    const rawX = ruleComponents.shift()
    if (rawX == null) {
      return Result.Failed(defaultDecodeFailureReason)
    }
    const x = parseInt(rawX, 10)
    if (isNaN(x) === true) {
      return Result.Failed(defaultDecodeFailureReason)
    }
    const rawY = ruleComponents.shift()
    if (rawY == null) {
      return Result.Failed(defaultDecodeFailureReason)
    }
    const y = parseInt(rawY, 10)
    if (isNaN(y) === true) {
      return Result.Failed(defaultDecodeFailureReason)
    }

    const rawAngle = ruleComponents.shift()
    if (rawAngle == null) {
      return Result.Failed(defaultDecodeFailureReason)
    }
    const angle = parseInt(rawAngle, 10)
    if (isNaN(angle) === true) {
      return Result.Failed(defaultDecodeFailureReason)
    }

    const rawLineCount = ruleComponents.shift()
    if (rawLineCount == null) {
      return Result.Failed(defaultDecodeFailureReason)
    }
    const lineCount = parseInt(rawLineCount, 10)
    if (isNaN(lineCount) === true) {
      return Result.Failed(defaultDecodeFailureReason)
    }

    const rawRule = ruleComponents.shift()
    if (rawRule == null) {
      return Result.Failed(defaultDecodeFailureReason)
    }
    try {
      const rule = new VanillaLSystemRule(rawRule)
      decodedRules.push({
        rule,
        position: new Vector(x, y),
        angle,
        lineCount,
      })
    } catch (e) {
      return Result.Failed(defaultDecodeFailureReason)
    }
  }

  return Result.Succeeded(decodedRules)
}