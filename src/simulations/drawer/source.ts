import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { Model } from "./model"
import { LSystemRule } from "./lsystem_drawer"
import { ScreenshotDownloader, JSONDownloader } from "../../classes/downloader"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
const firstRule: string | undefined = constants.system.run ? undefined : constants.simulation.lSystemRule
let currentModel = createModel(firstRule)

export const main = (p: p5) => {
  const downloader = new Downloader()

  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    p.background(0x0, 0xFF)
  }

  p.draw = () => {
    if (downloader.isSaving === true) {
      return
    }

    p.background(0x0, 0xFF)

    if (t % constants.simulation.executionInteral === 0) {
      currentModel.next()
    }
    currentModel.draw(p)

    if (constants.system.run && currentModel.result != undefined) {
      const result = currentModel.result
      const status = `${result.status.numberOfLines} lines`
      console.log(`completed at ${t} (${result.t} steps, ${result.reason}, ${status})\n${result.description}`)
      if (result.status.numberOfLines > 100) { // FixMe: 異なる状態から始めればすぐに終了しないかもしれないためこの終了条件は適していない
        downloader.save("", currentModel.lSystemRules, t)
      }
      currentModel = createModel()
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createModel(ruleString?: string): Model {
  const rules: LSystemRule[] = []
  if (ruleString != undefined) {
    try {
      rules.push(new LSystemRule(ruleString))
    } catch (error) {
      alert(`Invalid rule ${ruleString}`)
      throw error
    }
  } else {
    for (let i = 0; i < constants.simulation.numberOfSeeds; i += 1) {
      rules.push(LSystemRule.random())
    }
  }
  const model = new Model(
    new Vector(fieldSize, fieldSize),
    constants.simulation.maxLineCount,
    rules,
    constants.simulation.mutationRate,
  )
  model.showsBorderLine = constants.draw.showsBorderLine
  model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled

  return model
}

class Downloader {
  private _screenshotDownloader = new ScreenshotDownloader()
  private _JSONDownloader = new JSONDownloader()
  private _saved = 0
  private _saveInteral = 4000  // ms

  public get isSaving(): boolean {
    return (Date.now() - this._saved) < this._saveInteral
  }

  public save(filename: string, rules: LSystemRule[], timestamp: number) {
    if (this.isSaving === true) {
      console.log(`Attempt saving ${filename} while previous save is in progress (t: ${timestamp})`)

      return
    }
    this._saved = Date.now()
    this._screenshotDownloader.saveScreenshot(timestamp, filename)

    let intervalId: number | undefined
    const json = {
      t,
      rules: rules.map(rule => rule.encoded),
      url_parameters: document.location.search,
    }
    const delayed = () => { // Downloadin multiple files in exact same timing not working
      this._JSONDownloader.saveJson(json, filename, timestamp)
      clearInterval(intervalId)
    }
    intervalId = setInterval(delayed, 300)
  }
}
