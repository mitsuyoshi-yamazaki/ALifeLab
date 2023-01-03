import p5 from "p5"
import { random } from "../../classes/utilities"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { CellState } from "./cell_state"
import { exampleGrowthFunction } from "./growth_function"
import { minimumNeighbourKernel } from "./kernel"
import { Model } from "./model"
import { P5Drawer } from "./p5_drawer"

let t = 0
const canvasId = "canvas"
const fieldSize = 720
const cellSize = 12
const modelSize = Math.floor(fieldSize / cellSize)
const model = new Model(
  modelSize,
  minimumNeighbourKernel,
  exampleGrowthFunction,
)

model.initialize(size => {
  const states: CellState[][] = []

  for (let y = 0; y < size; y += 1) {
    const row: CellState[] = []
    states.push(row)

    for (let x = 0; x < size; x += 1) {
      if (random(1) < 0.5) {
        row.push(1)
      } else {
        row.push(0)
      }
    }
  }
  return states
})

export const main = (p: p5): void => {
  const drawer = new P5Drawer(p, fieldSize, cellSize)

  p.setup = () => {
    const canvas = p.createCanvas(drawer.canvasSize.x, drawer.canvasSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0x00)
  }

  p.draw = () => {
    model.step(1)

    drawer.drawCanvas()
    drawer.drawModel(model)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
