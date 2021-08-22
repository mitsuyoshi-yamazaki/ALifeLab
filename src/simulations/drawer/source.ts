import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { ImmortalModel, Model, Result, RuleDescription } from "./model"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { VanillaLSystemRule } from "./vanilla_lsystem_rule"
import { exampleRules } from "./rule_examples"
import { Downloader } from "./downloader"
import { TransitionColoredModel } from "./transition_colored_model"

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

    if (["depth", "transition"].includes(constants.draw.colorTheme)) {
      p.background(0xFF, 0xFF)
    } else {
      p.background(0xFF, 0xFF)
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

function createModel(ruleString?: string): Model {
  const rules: VanillaLSystemRule[] = []
  if (ruleString != null) {
    try {
      rules.push(new VanillaLSystemRule(ruleString))
    } catch (error) {
      alert(`Invalid rule ${ruleString}`)
      throw error
    }
  } else {
    const initialCondition = VanillaLSystemRule.initialCondition
    for (let i = 0; i < constants.simulation.numberOfSeeds; i += 1) {
      const tries = 20
      for (let j = 0; j < tries; j += 1) {
        const rule = VanillaLSystemRule.trimUnreachableConditions(VanillaLSystemRule.random(), initialCondition)
        if (rule.isCirculated(initialCondition)) {
          rules.push(rule)
          break
        }
      }
    }
    if (rules.length === 0) {
      rules.push(new VanillaLSystemRule(randomExampleRule()))
    }
  }
  const modelOf = (colorTheme: string): Model => {
    if (colorTheme === "transition") {
      return new TransitionColoredModel(
        new Vector(fieldSize, fieldSize),
        constants.simulation.maxLineCount,
        rules,
        constants.simulation.mutationRate,
        constants.simulation.lineLengthType,
        colorTheme,
        constants.simulation.fixedStartPoint,
        constants.simulation.obstacle,
      )
    } else {
      return new ImmortalModel(
        new Vector(fieldSize, fieldSize),
        constants.simulation.maxLineCount,
        rules,
        constants.simulation.mutationRate,
        constants.simulation.lineLengthType,
        colorTheme,
        constants.simulation.fixedStartPoint,
        constants.simulation.obstacle,
      )
    }
  }
  const model = modelOf(constants.draw.colorTheme)
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