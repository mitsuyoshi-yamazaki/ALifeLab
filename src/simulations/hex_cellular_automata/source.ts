import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Vector } from "../../classes/physics"
import { constants } from "./constants"
import { Model } from "./model"
import { BinaryRule } from "./rule"

let t = 0
const canvasId = "canvas"
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize)
const currentModel = createModel(constants.simulation.rule)

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    if (t % constants.simulation.executionInterval === 0) {
      p.background(0, 0xFF)

      currentModel.next()
      currentModel.draw(p, constants.simulation.cellSize)
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createModel(rule: BinaryRule): Model {
  const cellSize = constants.simulation.cellSize
  const automatonSize = new Vector(Math.floor(fieldSize.x / cellSize), Math.floor(fieldSize.y / ((cellSize * Math.sqrt(3)) / 2)))
  return new Model(automatonSize, rule, constants.simulation.initialState)
}