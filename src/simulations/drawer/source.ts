import p5 from "p5"
import { constants } from "./constants"
import { Vector } from "../../classes/physics"
import { Model, Result } from "./model"

let t = 0
const canvasId = "canvas"
const fieldSize = 600

const model = new Model(new Vector(fieldSize, fieldSize), constants.simulation.maxDrawerCount)
model.showsBorderLine = constants.draw.showsBorderLine
model.lineCollisionEnabled = constants.simulation.lineCollisionEnabled
model.completion = (result: Result) => {
  // TODO: モデルが終了したら次のモデルを実行する
  console.log(`completed at ${t} (${result.t})`)
}

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    p.background(0xFF, 0xFF)
  }

  p.draw = () => {
    p.background(0xFF, 0xFF)

    if (t % constants.simulation.executionInteral === 0) {
      model.next()
    }
    model.draw(p)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
