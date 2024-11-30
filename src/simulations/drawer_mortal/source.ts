import p5 from "p5"
import { constants } from "../drawer/constants"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Model, Result, RuleDescription } from "../drawer/model"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { Downloader } from "../drawer/downloader"
import { exampleRules } from "./rule_examples"
import { MortalModel } from "./mortal_model"
import { RandomRuleConstructor } from "../drawer/random_rule_constructor"

let t = 0
const canvasId = "canvas"
const fieldSize = constants.system.fieldSize
const firstRules: string[] = constants.system.run ? [] :
  (constants.simulation.lSystemRule.length > 0 ? [constants.simulation.lSystemRule] : exampleRules.map(rule => rule.rule))
let currentModel = createModel(firstRules)
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

    p.background(0x0, 0xFF)

    if (t % constants.simulation.executionInterval === 0) {
      currentModel.execute()
    }
    currentModel.draw(p, constants.draw.showsQuadtree)

    if (constants.system.run && currentModel.result != null) {
      const result = currentModel.result
      const rules = result.rules.sort((lhs: RuleDescription, rhs: RuleDescription) => {
        if (lhs.numberOfDrawers === rhs.numberOfDrawers) {
          return 0
        }
        return lhs.numberOfDrawers < rhs.numberOfDrawers ? 1 : -1
      })
      const ruleDescription = rules.reduce((r, rule) => `${r}\n${rule.numberOfDrawers} drawers: ${rule.rule}`, "")
      console.log(`completed at ${t} (${result.t} steps, ${result.reason}) ${result.description}\n${ruleDescription}`)
      if (constants.system.autoDownload && shouldSave(result)) {
        downloader.save("", rules, t, result.t)
      }
      currentModel = createModel([])
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

function createModel(ruleStrings: string[]): Model {
  const rules: VanillaLSystemRule[] = []
  if (ruleStrings.length > 0) {
    try {
      rules.push(...ruleStrings.map(rule => new VanillaLSystemRule(rule)))
    } catch (error) {
      console.log(`Invalid rule: ${error}`)
      alert("Invalid rule")
      throw error
    }
  } else {
    const initialCondition = VanillaLSystemRule.initialCondition
    for (let i = 0; i < constants.simulation.numberOfSeeds; i += 1) {
      const tries = 20
      for (let j = 0; j < tries; j += 1) {
        const rule = VanillaLSystemRule.trimUnreachableConditions(RandomRuleConstructor.random(), initialCondition)
        if (rule.isCirculated(initialCondition)) {
          rules.push(rule)
          break
        }
      }
    }
    if (rules.length === 0) {
      const exampleRule = exampleRules[Math.floor(random(exampleRules.length))]
      rules.push(new VanillaLSystemRule(exampleRule.rule))
    }
  }
  const model = new MortalModel(
    new Vector(fieldSize, fieldSize),
    constants.simulation.maxLineCount,
    rules,
    constants.simulation.mutationRate,
    constants.simulation.lineLifeSpan,
    constants.system.run === false,
    constants.draw.colorTheme,
    constants.simulation.fixedStartPoint,
    constants.simulation.obstacle,
  )
  model.showsBorderLine = constants.draw.showsBorderLine
  model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled
  model.quadtreeEnabled = constants.system.quadtreeEnabled
  model.concurrentExecutionNumber = constants.simulation.concurrentExecutionNumber

  return model
}

function shouldSave(result: Result): boolean {
  switch (result.reason) {  // FixMe: URLパラメータが変更されると終了条件が不適切になる
  case "Stable":
    if (result.t <= 6000) {
      return false
    }
    break
  
  case "All died":
    if (result.t < 200) {
      return false
    }
    break
    
  case "Timeout":
  default:
    break
  }
  return true
}
