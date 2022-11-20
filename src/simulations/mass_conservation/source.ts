import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { P5Drawer } from "./p5_drawer"
import { CellState, World } from "./world"

let t = 0
const canvasId = "canvas"
const cellSize = 4
const worldSize = new Vector(200, 200)
const fieldSize = worldSize.mult(cellSize)

export const main = (p: p5): void => {
  const world = new World(worldSize, initializeStates())
  const drawer = new P5Drawer(p, cellSize)

  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    world.calculate()
    
    const drawableObjects = [
      world.drawableState(),
    ]
    drawer.drawAll(drawableObjects)
    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

const initializeStates = (): CellState[][] => {
  const initialMaximumPressure = 1000
  const result: CellState[][] = []

  for (let y = 0; y < worldSize.y; y += 1) {
    const row: CellState[] = []
    result.push(row)

    for (let x = 0; x < worldSize.x; x += 1) {
      row.push({
        mass: Math.floor(random(initialMaximumPressure)),
      })
    }
  }

  return result
}
