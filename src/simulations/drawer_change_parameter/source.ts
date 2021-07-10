import p5 from "p5"
import { constants } from "../drawer/constants"
import { Vector } from "../../classes/physics"
import { ScreenshotDownloader, JSONDownloader } from "../../classes/downloader"
import { ImmortalModel, Model } from "../drawer/model"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { TransitionColoredModel } from "../drawer/transition_colored_model"
import { FlexibleLsystemRule } from "./flexible_lsystem_rule"

const parameterDownloader = new JSONDownloader()
const screenshotDownloader = new ScreenshotDownloader()
let saved = Date.now()
const saveInterval = 300 // ms

let t = 0
let n = 0
const canvasId = "canvas"
const fieldSize = constants.system.fieldSize
const flexibleRules = createRules()
let currentModel = createModel()

export const canvasWidth = fieldSize

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0x0, 0xFF)
  }

  p.draw = () => {
    if (currentModel == null) {
      return 
    }
    if (Date.now() - saved < saveInterval) {
      return
    }

    if (["depth", "transition"].includes(constants.draw.colorTheme)) {
      p.background(0xFF, 0xFF)
    } else {
      p.background(0x0, 0xFF)
    }

    if (t % constants.simulation.executionInterval === 0) {
      currentModel.execute()
    }
    currentModel.draw(p, constants.draw.showsQuadtree)

    if (currentModel.result != null) {
      console.log(`${n}: ${currentModel.lSystemRules[0].encoded}`)
      if (constants.system.autoDownload) {
        saveScreenshot()
      }
      currentModel = createModel()
    }

    t += 1
  }
}

function saveParameters(rules: FlexibleLsystemRule[]): void {
  saved = Date.now()

  const json = {
    t: t,
    rules: rules.map(r => r.rule.encoded),
    url_parameters: document.location.search,
  }
  parameterDownloader.saveJson(json, "", 0)
}

function saveScreenshot(): void {
  saved = Date.now()

  screenshotDownloader.saveScreenshot(n)
}

function createRules(): FlexibleLsystemRule[] {
  try {
    const ruleComponents = constants.simulation.changeParameter.changes.split(";;;")
    const rules = ruleComponents.map(component => {
      const [rawRule, rawChanges] = component.split(";;")
      if (rawRule == null || rawChanges == null) {
        throw new Error("simulation.parameter_changes の形式が間違っています。<rule1>;;<changes1>;;;<rule2>;;<changes2>#...")
      }

      const rule = new VanillaLSystemRule(rawRule)
      const changes = FlexibleLsystemRule.decodeChanges(rawChanges)
      return new FlexibleLsystemRule(rule, changes)
    })

    saveParameters(rules)
    return rules
    
  } catch (error) {
    alert(`パラメータが間違っています\n${error}`)
    return []
  }
}

function createModel(): Model | null {
  if (flexibleRules.length <= 0) {
    return null
  }
  if (n >= constants.simulation.changeParameter.period) {
    alert("FINISHED!")
    return null
  }

  const fixedStartPoint = true
  const rules = flexibleRules.map(flexibleRule => flexibleRule.ruleOf(n))
  n += 1

  const maxLineCount = constants.simulation.maxLineCount * rules.length

  const modelOf = (colorTheme: string): Model => {
    if (colorTheme === "transition") {
      return new TransitionColoredModel(
        new Vector(fieldSize, fieldSize),
        maxLineCount,
        rules,
        constants.simulation.mutationRate,
        constants.simulation.lineLengthType,
        colorTheme,
        fixedStartPoint,
        constants.simulation.obstacle,
      )
    } else {
      return new ImmortalModel(
        new Vector(fieldSize, fieldSize),
        maxLineCount,
        rules,
        constants.simulation.mutationRate,
        constants.simulation.lineLengthType,
        colorTheme,
        fixedStartPoint,
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
