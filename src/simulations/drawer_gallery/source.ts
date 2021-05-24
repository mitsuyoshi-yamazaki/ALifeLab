import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { ImmortalModel, RuleDescription } from "../drawer/model"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { exampleRules } from "../drawer/rule_examples"
import { Downloader } from "../drawer/downloader"

let t = 0
const executionInterval = 1
const canvasId = "canvas"
const fieldSize = 600 // TODO: 決める

const maxLineCount = 5000
const mutationRate = 0
const lineLengthType = 0
const colorTheme = "grayscale"
const fixedStartPoint = false

let rules = [...exampleRules]
let currentModel = createModel()
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

    p.background(0x0, 0xFF)

    if (t % executionInterval === 0) {
      currentModel.execute()
    }
    currentModel.draw(p, false)

    if (currentModel.result != null) {
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

function createModel(): ImmortalModel {
  const rule = nextRule()
  const rules: VanillaLSystemRule[] = []
  try {
    rules.push(new VanillaLSystemRule(rule))
  } catch (error) {
    alert(`Invalid rule ${rule}`)
    throw error
  }
  const model = new ImmortalModel(
    new Vector(fieldSize, fieldSize),
    maxLineCount,
    rules,
    mutationRate,
    lineLengthType,
    colorTheme,
    fixedStartPoint,
  )
  model.showsBorderLine = false
  model.lineCollisionEnabled = true
  model.quadtreeEnabled = true
  model.concurrentExecutionNumber = 100 // TODO: 調整する

  return model
}

function nextRule(): string {
  if (rules.length === 0) {
    rules = [...exampleRules]
  }
  return rules.splice(Math.floor(random(rules.length)), 1)[0]
}
