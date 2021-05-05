import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/default_canvas_parent_id"
import { constants } from "./constants"
import { Kaleidoscope } from "./kaleidoscope"

let t = 0
const canvasId = "canvas"
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize)
const kaleidoscope = new Kaleidoscope(fieldSize.div(2))

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.rectMode(p.CENTER)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    if (t % constants.simulation.executionInterval === 0) {
      p.background(0, 0xFF)
      kaleidoscope.next()
      kaleidoscope.draw(p)
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
