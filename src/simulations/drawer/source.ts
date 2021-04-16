import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { Model, Result } from "./model"
import { ScreenshotDownloader } from "../../classes/downloader"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
let currentModel = createModel()
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

    if (currentModel.result != undefined) {
      const result = currentModel.result
      console.log(`completed at ${t} (${result.t}, ${result.reason})`)
      screenshotDownloader.saveScreenshot(t, `${result.reason} at ${result.t}`)
      currentModel = createModel()
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createModel(): Model {
  const model = new Model(new Vector(fieldSize, fieldSize), constants.simulation.maxDrawerCount)
  model.showsBorderLine = constants.draw.showsBorderLine
  model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled

  return model
}
