import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"

let t = 0
const canvasId = "canvas"
const fieldSize = 600

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    p.background(0, 0xFF)
    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
