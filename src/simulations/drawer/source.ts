import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { Model } from "./model"
import { LSystemRule } from "./lsystem_drawer"
import { ScreenshotDownloader } from "../../classes/downloader"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
const firstRule: string | undefined = constants.system.run ? undefined : constants.simulation.lSystemRule
let currentModel = createModel(firstRule)
const screenshotDownloader = new ScreenshotDownloader()
let saved = 0
const saveInteral = 2500  // ms

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    p.background(0x0, 0xFF)
  }

  p.draw = () => {
    if (Date.now() - saved < saveInteral) {
      return
    }

    p.background(0x0, 0xFF)

    if (t % constants.simulation.executionInteral === 0) {
      currentModel.next()
    }
    currentModel.draw(p)

    if (constants.system.run && currentModel.result != undefined) {
      const result = currentModel.result
      console.log(`completed at ${t} (${result.t}, ${result.reason}, ${result.status})\n${result.description}`)
      screenshotDownloader.saveScreenshot(t, `${result.description}`)
      currentModel = createModel()
      saved = Date.now()
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
    const model = new Model(
      new Vector(fieldSize, fieldSize),
      constants.simulation.maxLineCount,
      rule,
    )
    model.showsBorderLine = constants.draw.showsBorderLine
    model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled

    return model
  } catch (error) {
    alert(`Invalid rule ${ruleString}`)
    throw error
  }
}
