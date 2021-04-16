import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { Model } from "./model"
import { LSystemRule } from "./lsystem_drawer"
import { ScreenshotDownloader } from "../../classes/downloader"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
let currentModel = createModel(constants.simulation.lSystemRule)
const screenshotDownloader = new ScreenshotDownloader()

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    p.background(0xFF, 0xFF)
  }

  p.draw = () => {
    p.background(0xFF, 0xFF)

    if (t % constants.simulation.executionInteral === 0) {
      currentModel.next()
    }
    currentModel.draw(p)

    if (constants.system.run && currentModel.result != undefined) {
      const result = currentModel.result
      console.log(`completed at ${t} (${result.t}, ${result.reason})\n${result.description}`)
      screenshotDownloader.saveScreenshot(t, `${result.description}`)
      currentModel = createModel()
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createModel(ruleString?: string): Model {
  try {
    const rule = ruleString != undefined ? new LSystemRule(ruleString) : LSystemRule.random()
    const model = new Model(new Vector(fieldSize, fieldSize), constants.simulation.maxDrawerCount, rule)
    model.showsBorderLine = constants.draw.showsBorderLine
    model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled

    return model
  } catch (error) {
    alert(`Invalid rule ${ruleString}`)
    throw error
  }
}
