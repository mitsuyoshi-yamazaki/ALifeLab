import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { Model, Result, RuleDescription } from "./model"
import { defaultCanvasParentId } from "../../react-components/default_canvas_parent_id"
import { LSystemRule } from "./lsystem_rule"
import { ScreenshotDownloader, JSONDownloader } from "../../classes/downloader"
import { exampleRules } from "./rule_examples"

let t = 0
const canvasId = "canvas"
const fieldSize = constants.system.fieldSize
const firstRule: string | undefined = constants.system.run ? undefined : constants.simulation.lSystemRule
let currentModel = createModel(firstRule)

export const canvasWidth = fieldSize

export const main = (p: p5): void => {
  const downloader = new Downloader()

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

    if (constants.system.run && currentModel.result != undefined) {
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

export const getTimestamp = (): number => {
  const message = currentModel.lSystemRules.map(rule => rule.encoded).join("\n")
  console.log(message) // FixMe: 現状では寿命モードのルールを知る術がないためコンソールに出力する
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
    const initialCondition = LSystemRule.initialCondition
    for (let i = 0; i < constants.simulation.numberOfSeeds; i += 1) {
      const tries = 20
      for (let j = 0; j < tries; j += 1) {
        const rule = LSystemRule.trimUnreachableConditions(LSystemRule.random(), initialCondition)
        if (rule.isCirculated(initialCondition)) {
          rules.push(rule)
          break
        }
      }
    }
    if (rules.length == 0) {
      const exampleRule = exampleRules[Math.floor(random(exampleRules.length))]
      rules.push(new LSystemRule(exampleRule))
    }
  }
  const model = new Model(
    new Vector(fieldSize, fieldSize),
    constants.simulation.maxLineCount,
    rules,
    constants.simulation.mutationRate,
    constants.simulation.lineLifeSpan,
    constants.simulation.lineLengthType,
    constants.simulation.fixedStartPoint,
  )
  model.showsBorderLine = constants.draw.showsBorderLine
  model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled
  model.quadtreeEnabled = constants.system.quadtreeEnabled
  model.concurrentExecutionNumber = constants.simulation.concurrentExecutionNumber

  return model
}

function shouldSave(result: Result): boolean {
  if (result.status.numberOfLines < 500) {
    return false
  }
  return true
}

class Downloader {
  private _screenshotDownloader = new ScreenshotDownloader()
  private _JSONDownloader = new JSONDownloader()
  private _saved = 0
  private _saveInteral = 4000  // ms

  public get isSaving(): boolean {
    return (Date.now() - this._saved) < this._saveInteral
  }

  public save(filename: string, rules: RuleDescription[], globalTimestamp: number, modelTimeStamp: number) {
    if (this.isSaving === true) {
      console.log(`Attempt saving ${filename} while previous save is in progress (t: ${globalTimestamp})`)

      return
    }
    this._saved = Date.now()
    this._screenshotDownloader.saveScreenshot(globalTimestamp, filename)

    let intervalId: number | undefined = undefined
    const json = {
      t: modelTimeStamp,
      rules,
      url_parameters: document.location.search,
    }
    const delayed = () => { // Downloading multiple files in exact same timing not working
      this._JSONDownloader.saveJson(json, filename, globalTimestamp)
      clearInterval(intervalId)
    }
    intervalId = setInterval(delayed, 300)
  }
}
