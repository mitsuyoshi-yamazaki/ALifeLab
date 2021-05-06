import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { constants } from "./constants"
import { Model } from "./model"
import { SimpleMembraneRule } from "./rule"
import { BinaryColorPalette } from "./color_palette"

let t = 0
const canvasId = "canvas"
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize)
const model = createModel()

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
      model.next()
      model.draw(p, constants.simulation.cellSize)
    }
    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createModel(): Model {
  const cellSize = constants.simulation.cellSize
  const automatonSize = new Vector(Math.floor(fieldSize.x / cellSize), Math.floor(fieldSize.y / ((cellSize * Math.sqrt(3)) / 2)))
  const rule = new SimpleMembraneRule(constants.simulation.radius)
  return new Model(automatonSize, rule, new BinaryColorPalette(), constants.simulation.initialState)
}