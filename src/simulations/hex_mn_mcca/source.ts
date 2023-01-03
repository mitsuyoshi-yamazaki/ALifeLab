import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { CellState } from "./cell_state"
import { HexVector } from "./coordinate"
import { Model } from "./model"
import { P5Drawer } from "./p5_drawer"

let t = 0
const canvasId = "canvas"
const fieldSize = 720
const cellSize = 12
const modelSize = Math.floor(fieldSize / cellSize)
const model = new Model(modelSize)

model.initialize(size => {
  const states: CellState[][] = []

  for (let y = 0; y < size; y += 1) {
    const row: CellState[] = []
    states.push(row)

    for (let x = 0; x < size; x += 1) {
      const vector = new HexVector(x, y)
      if (vector.r === vector.q || vector.q === vector.s || vector.s === vector.r) {
        // console.log(`${vector}`)
        row.push({ alive: true })
      } else {
        row.push({ alive: false })
      }
    }

    // console.log(`${y}: ${row.map(x => x.alive ? 1 : 0)}`)
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
