import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { P5Drawer } from "./p5_drawer"
import { World } from "./world"

let t = 0
const canvasId = "canvas"
const cellSize = 4
const worldSize = new Vector(200, 200)
const fieldSize = worldSize.mult(cellSize)

export const main = (p: p5): void => {
  const world = new World(worldSize)
  const drawer = new P5Drawer(p)

  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    const drawableObjects = [
      world.drawableState(),
      ...world.getDrawableObjects().map(obj => obj.drawableState()),
    ]
    drawer.drawAll(drawableObjects)
    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
