import p5 from "p5"
import { constants } from "../drawer/constants"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Result, RuleDescription } from "../drawer/model"
import { Downloader } from "../drawer/downloader"
import { SymmetryModel } from "./symmetry_model"
import { SymmetricLSystemRule } from "./symmetric_lsystem_rule"
import { exampleRules } from "./rule_examples"

let t = 0
const canvasId = "canvas"
const fieldSize = constants.system.fieldSize
const firstRule: string | null = constants.system.run ? null :
  (constants.simulation.lSystemRule.length > 0 ? constants.simulation.lSystemRule : randomExampleRule())
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

    if (["depth", "direction"].includes(constants.draw.colorTheme)) {
      p.background(0xFF, 0xFF)
    } else {
      p.background(0xFF, 0xFF)
    }

    if (t % constants.simulation.executionInterval === 0) {
      currentModel.execute()
    }
    currentModel.draw(p, constants.draw.showsQuadtree)

    if (constants.system.run && currentModel.result != null) {
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
      currentModel = createModel(null)
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

function createModel(ruleString: string | null): SymmetryModel {
  const rules: SymmetricLSystemRule[] = []
  if (ruleString != null) {
    rules.push(new SymmetricLSystemRule(ruleString))
  } else {
    rules.push(SymmetricLSystemRule.random(constants.simulation.symmetric))
  }
  const model = new SymmetryModel(
    new Vector(fieldSize, fieldSize),
    constants.simulation.maxLineCount,
    rules,
    constants.simulation.mutationRate,
    constants.simulation.lineLifeSpan,
    constants.draw.colorTheme,
    constants.simulation.fixedStartPoint,
    constants.simulation.obstacle,
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

function randomExampleRule(): string {
  return exampleRules[Math.floor(random(exampleRules.length))]
}
