import p5 from "p5"
import { constants } from "../drawer/constants"
import { Vector } from "../../classes/physics"
import { ImmortalModel, Model, ModelOptions, RuleDescription } from "../drawer/model"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { Downloader } from "../drawer/downloader"
import { RandomRuleConstructor } from "../drawer/random_rule_constructor"

let t = 0
const canvasId = "canvas"
const fieldSize = constants.system.fieldSize


const initialCondition = VanillaLSystemRule.initialCondition
const generateNewRule = (): VanillaLSystemRule => {
  const tries = 40
  for (let j = 0; j < tries; j += 1) {
    const rule = VanillaLSystemRule.trimUnreachableConditions(RandomRuleConstructor.graph(), initialCondition)
    if (rule.isCirculated(initialCondition)) {
      return rule
    }
  }
  return VanillaLSystemRule.trimUnreachableConditions(RandomRuleConstructor.graph(), initialCondition) // FixMe: isCirculatedチェックがない
}

let stop = false

let currentModel = createModel(generateNewRule())
const downloader = new Downloader()
const backgroundWhite = 0x00
export const canvasWidth = fieldSize


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

    t += 1
  }
}

/** @throws */
export const changeRule = (ruleString: string): "ok" | string => {
  try {
    currentModel = createModel(new VanillaLSystemRule(ruleString))
    if (stop === true) {
      stop = false
    }
    console.log(`rule updated: ${ruleString}`)
    return "ok"

  } catch (error) {
    console.log(`validation error: ${error}`)
    stop = true

    return `${error}`
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

function createModel(rule: VanillaLSystemRule): Model {
  const mutationRate = 0
  const lineLengthType = 0
  const colorTheme = "grayscale"
  const fixedStartPoint = true
  const obstacle = false
  const lineWeight = (() => {
    if (constants.system.fieldSize >= 1000) {
      return 1
    }
    return 0.5
  })()
  const options: ModelOptions = {
    lineWeight,
  }

  const model = new ImmortalModel(
    new Vector(fieldSize, fieldSize),
    constants.simulation.maxLineCount,
    [rule],
    mutationRate,
    lineLengthType,
    colorTheme,
    fixedStartPoint,
    obstacle,
    options,
  )

  model.showsBorderLine = constants.draw.showsBorderLine
  model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled
  model.quadtreeEnabled = constants.system.quadtreeEnabled
  model.concurrentExecutionNumber = constants.simulation.concurrentExecutionNumber

  return model
}
