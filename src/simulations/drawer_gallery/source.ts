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

const numberOfSeeds = 1
const maxLineCount = 5000
const mutationRate = 0
const lineLengthType = 0
const colorTheme = "grayscale"
const fixedStartPoint = false

const firstRule: string | undefined = randomExampleRule()
let currentModel = createModel(firstRule)
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

function createModel(ruleString?: string): ImmortalModel {
  const rules: VanillaLSystemRule[] = []
  if (ruleString != null) {
    try {
      rules.push(new VanillaLSystemRule(ruleString))
    } catch (error) {
      alert(`Invalid rule ${ruleString}`)
      throw error
    }
  } else {
    const initialCondition = VanillaLSystemRule.initialCondition
    for (let i = 0; i < numberOfSeeds; i += 1) {
      const tries = 20
      for (let j = 0; j < tries; j += 1) {
        const rule = VanillaLSystemRule.trimUnreachableConditions(VanillaLSystemRule.random(), initialCondition)
        if (rule.isCirculated(initialCondition)) {
          rules.push(rule)
          break
        }
      }
    }
    if (rules.length === 0) {
      rules.push(new VanillaLSystemRule(randomExampleRule()))
    }
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

function randomExampleRule(): string {
  return exampleRules[Math.floor(random(exampleRules.length))]
}