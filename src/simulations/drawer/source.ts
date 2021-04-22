import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { ImmortalModel, Result, RuleDescription } from "./model"
import { defaultCanvasParentId } from "../../react-components/default_canvas_parent_id"
import { VanillaLSystemRule } from "./vanilla_lsystem_rule"
import { exampleRules } from "./rule_examples"
import { Downloader } from "./downloader"

let fillRuleConditionIndex = 0
let fillRuleNextConditionIndex = 0

let t = 0
const canvasId = "canvas"
const fieldSize = constants.system.fieldSize
const firstRule: string | undefined = constants.system.run ? undefined :
  (constants.simulation.lSystemRule.length > 0 ? constants.simulation.lSystemRule : randomExampleRule())
let currentModel = createModel(firstRule)
const downloader = new Downloader()

export const canvasWidth = fieldSize

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0x0, 0xFF)
  }

  p.draw = () => {
    if (downloader.isSaving === true) {
      return
    }

    if (constants.draw.colorTheme === "depth") {
      p.background(0xFF, 0xFF)
    } else {
      p.background(0x0, 0xFF)
    }

    if (t % constants.simulation.executionInterval === 0) {
      currentModel.execute()
    }
    currentModel.draw(p, constants.draw.showsQuadtree)

    if (constants.system.run && currentModel.result != null) {
      const result = currentModel.result
      const status = `${result.status.numberOfLines} lines, ${result.status.numberOfNodes} nodes`
      const rules = result.rules.sort((lhs: RuleDescription, rhs: RuleDescription) => {
        if (lhs.numberOfDrawers === rhs.numberOfDrawers) {
          return 0
        }
        return lhs.numberOfDrawers < rhs.numberOfDrawers ? 1 : -1
      })
      const ruleDescription = rules.reduce((r, rule) => `${r}\n${rule.numberOfDrawers} drawers: ${rule.rule}`, "")
      console.log(`completed at ${t} (${result.t} steps, ${result.reason}, ${status}) ${result.description}\n${ruleDescription}`)
      if (constants.system.autoDownload && shouldSave(result)) {
        downloader.save("", rules, t, result.t)
      }
      currentModel = createModel()
    }

    t += 1
  }
}

export const saveCurrentState = (): void => {
  const result = currentModel.currentResult("Running")
  const rules = result.rules.sort((lhs: RuleDescription, rhs: RuleDescription) => {
    if (lhs.numberOfDrawers === rhs.numberOfDrawers) {
      return 0
    }
    return lhs.numberOfDrawers < rhs.numberOfDrawers ? 1 : -1
  })
  downloader.save("", rules, t, result.t)
}

function createModel(ruleString?: string): ImmortalModel {
  const rules: VanillaLSystemRule[] = []
  if (ruleString != null) {
    try {
      rules.push(new VanillaLSystemRule(ruleString))
    } catch (error) {
      alert(`Invalid rule ${ruleString}`)
      throw error
    }
  } else {
    // const initialCondition = VanillaLSystemRule.initialCondition
    // for (let i = 0; i < constants.simulation.numberOfSeeds; i += 1) {
    //   const tries = 20
    //   for (let j = 0; j < tries; j += 1) {
    //     const rule = VanillaLSystemRule.trimUnreachableConditions(VanillaLSystemRule.random(), initialCondition)
    //     if (rule.isCirculated(initialCondition)) {
    //       rules.push(rule)
    //       break
    //     }
    //   }
    // }
    // if (rules.length === 0) {
    //   rules.push(new VanillaLSystemRule(randomExampleRule()))
    // }
    rules.push(nextFillRule())
  }
  const model = new ImmortalModel(
    new Vector(fieldSize, fieldSize),
    constants.simulation.maxLineCount,
    rules,
    constants.simulation.mutationRate,
    constants.simulation.lineLengthType,
    constants.draw.colorTheme,
    constants.simulation.fixedStartPoint,
  )
  model.showsBorderLine = constants.draw.showsBorderLine
  model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled
  model.quadtreeEnabled = constants.system.quadtreeEnabled
  model.concurrentExecutionNumber = constants.simulation.concurrentExecutionNumber

  return model
}

function shouldSave(result: Result): boolean {
  if (result.status.numberOfLines < 100) {
    return false
  }
  return true
}

function randomExampleRule(): string {
  return exampleRules[Math.floor(random(exampleRules.length))]
}

function nextFillRule(): VanillaLSystemRule {
  // const fillRule = "Z:-28,Z,117,Z"
  // const fillRule = "Z:-64,X,120,Z;X:125,Y;Y:-122,X,155,Z"
  const fillRule = "Z:131,Y;Y:51,Z,141,Z"
  const baseRuleString = "A:93,E;B:-113,H,-173,H,-76,E,152,C,62,C;C:-106,B;D:.;E:-34,F,-18,C,-41,B;F:-112,E,37,E,104,B;G:.;H:-155,F,130,D" + ";" + fillRule
  const baseRule = VanillaLSystemRule.decode(baseRuleString)
  const conditions = (new VanillaLSystemRule(baseRuleString)).possibleConditions
  if (fillRuleConditionIndex >= conditions.length) {
    throw new Error("finished!")
  }
  const condition = conditions[fillRuleConditionIndex]
  const nextConditions = baseRule.get(condition)
  if (nextConditions == null) {
    throw new Error(`Unexpected error: no next condition for ${condition}`)
  }
  if (fillRuleNextConditionIndex >= nextConditions.length) {
    fillRuleConditionIndex += 1
    fillRuleNextConditionIndex = 0
    return nextFillRule()
  }
  nextConditions.splice(fillRuleNextConditionIndex, 0, 0)
  nextConditions.splice(fillRuleNextConditionIndex + 1, 0, "Z")

  const rule = new VanillaLSystemRule(baseRule)
  console.log(`Fill rule ${condition}, ${fillRuleNextConditionIndex}: ${rule.encoded}`)
  fillRuleNextConditionIndex += 2

  return rule
}