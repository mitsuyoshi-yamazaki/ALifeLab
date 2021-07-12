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
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize * 9 / 16)
const flexibleRule = createRule()
let currentModel = createModel()

export const canvasWidth = fieldSize.x

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
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

    const rule = currentModel.lSystemRules[0]
    if (rule != null) {
      const textSize = 16
      const margin = 32

      const floored = rule.encoded.split(";").map(transition => {
        const transitionComponents = transition.split(":")
        const components = transitionComponents[1].split(",").map(c => {
          const i = parseFloat(c)
          if (isNaN(i)) {
            return c
          }
          return i > 0 ? `${Math.floor(i)}` : `${Math.ceil(i)}`
        })
        return `${transitionComponents[0]}:${components.join(",")}`
      }).join(";")

      const text = floored
        .replace(/,/g, "")
        .replace(/:/g, "→")
        .replace(/;/g, ", ")

      p.fill(0xFF, 0xC0)
      p.textStyle(p.NORMAL)
      p.textAlign(p.RIGHT)
      p.textSize(textSize)
      p.text(text, fieldSize.x - margin, margin)
    }

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

function saveParameters(rule: FlexibleLsystemRule): void {
  saved = Date.now()

  const json = {
    t: t,
    rule: rule.rule.encoded,
    url_parameters: document.location.search,
  }
  parameterDownloader.saveJson(json, "", 0)
}

function saveScreenshot(): void {
  saved = Date.now()

  screenshotDownloader.saveScreenshot(n)
}

function createRule(): FlexibleLsystemRule | null {
  try {
    const rule = new VanillaLSystemRule(constants.simulation.lSystemRule)
    const changes = FlexibleLsystemRule.decodeChanges(constants.simulation.changeParameter.changes)
    const flexibleRule = new FlexibleLsystemRule(rule, changes)
    if (constants.system.autoDownload) {
      saveParameters(flexibleRule)
    }
    return flexibleRule
  } catch (error) {
    alert(`パラメータが間違っています\n${error}`)
    return null
  }
}

function createModel(): Model | null {
  if (flexibleRule == null) {
    return null
  }
  if (n >= constants.simulation.changeParameter.period) {
    alert("FINISHED!")
    return null
  }

  const fixedStartPoint = true
  const rules = [flexibleRule.ruleOf(n)]
  n += 1

  const modelOf = (colorTheme: string): Model => {
    if (colorTheme === "transition") {
      return new TransitionColoredModel(
        fieldSize,
        constants.simulation.maxLineCount,
        rules,
        constants.simulation.mutationRate,
        constants.simulation.lineLengthType,
        colorTheme,
        fixedStartPoint,
        constants.simulation.obstacle,
      )
    } else {
      return new ImmortalModel(
        fieldSize,
        constants.simulation.maxLineCount,
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
