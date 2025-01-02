import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { ImmortalModel, Model, ModelOptions, Result, RuleDescription } from "./model"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { VanillaLSystemRule } from "./vanilla_lsystem_rule"
import { exampleRules } from "./rule_examples"
import { Downloader } from "./downloader"
import { TransitionColoredModel } from "./transition_colored_model"
import { RandomRuleConstructor } from "./random_rule_constructor"
import { ColorTheme } from "./color_theme"

let t = 0
const canvasId = "canvas"
const fieldSize = constants.system.fieldSize

const firstRuleString = ((): string | undefined => {
  if (constants.simulation.swap === true) {
    if (constants.simulation.lSystemRule.length <= 0) {
      const errorMessage = "simulation.swapを設定する際は同時にsimulation.lsystem_ruleを指定する必要があります"
      alert(errorMessage)
      throw errorMessage 
    }
    return constants.simulation.lSystemRule
  }

  if (constants.system.run === true) {
    return undefined
  }

  if (constants.simulation.lSystemRule.length > 0) {
    return constants.simulation.lSystemRule
  }
  return randomExampleRule()
})()

const initialCondition = VanillaLSystemRule.initialCondition
const generateNewRule = (): VanillaLSystemRule | null => {
  const tries = 20
  for (let j = 0; j < tries; j += 1) {
    const rule = VanillaLSystemRule.trimUnreachableConditions(RandomRuleConstructor.graph(), initialCondition)
    if (rule.isCirculated(initialCondition)) {
      return rule
    }
  }
  return null
}

let currentRule = ((): VanillaLSystemRule => {
  if (firstRuleString == null) {
    return generateNewRule() ?? new VanillaLSystemRule(randomExampleRule())
  }
  try {
    return new VanillaLSystemRule(firstRuleString)
  } catch (error) {
    console.log(`Invalid rule: ${firstRuleString}`)
    alert(`Invalid rule: ${firstRuleString}`)
    throw error
  }
})()

let stop = false

let currentModel = createModel([currentRule])
const downloader = new Downloader()

const backgroundWhite = ((): number => {
  switch (constants.draw.colorTheme) {
  case "ascii":
  case "direction":
  case "grayscale":
    return 0x00

  case "depth":
  case "transition":
  case "grayscale_black":
    return 0xFF
    
  default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = constants.draw.colorTheme
    throw `Unknown color theme ${constants.draw.colorTheme}`
  }
  }
})()

export const canvasWidth = fieldSize

export function upload(url: string): void {
  const body = {
    text: "Zapier webhookのテスト"
  }

  const request = new Request(url, { method: "POST", body: JSON.stringify(body) })
  fetch(request)
}

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(backgroundWhite, 0xFF)
  }

  p.draw = () => {
    if (stop === true) {
      return
    }

    if (downloader.isSaving === true) {
      return
    }

    p.background(backgroundWhite, 0xFF)

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

      try {
        if (constants.simulation.numberOfSeeds > 1) {
          currentModel = createModel(generateNewRules())
        } else {
          currentRule = generateNextRule(currentRule)
          currentModel = createModel([currentRule])
        }
      } catch (error) {
        alert(error)
        stop = true
      }
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

export const setRunning = (running: boolean): void => {
  stop = !running
}

export const toggleRunning = (): void => {
  stop = !stop
}

const generateNewRules = (): VanillaLSystemRule[] => {
  const rules: VanillaLSystemRule[] = []
  for (let i = 0; i < constants.simulation.numberOfSeeds; i += 1) {
    const rule = generateNewRule()
    if (rule != null) {
      rules.push(rule)
    }
  }
  if (rules.length === 0) {
    console.error("random rule generation failed.. drawing predefined patterns")
    rules.push(new VanillaLSystemRule(randomExampleRule()))
  }

  return rules
}

const generateNextRule = (rule: VanillaLSystemRule): VanillaLSystemRule => {
  if (constants.simulation.swap === true) {
    return RandomRuleConstructor.swapMutated(rule)
  }

  return generateNewRule() ?? new VanillaLSystemRule(randomExampleRule())
}

function createModel(rules: VanillaLSystemRule[]): Model {
  const modelOf = (colorTheme: ColorTheme): Model => {
    const lineWeight = (() => {
      if (constants.simulation.lineWeight !== -1) {
        return constants.simulation.lineWeight
      }
      if (constants.system.fieldSize >= 1000) {
        return 1
      }
      return 0.5
    })()
    const options: ModelOptions = {
      lineWeight,
    }

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
        options,
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
        options,
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