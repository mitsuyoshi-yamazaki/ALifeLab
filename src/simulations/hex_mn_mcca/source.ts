import p5 from "p5"
import { random } from "../../classes/utilities"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { CellState } from "./cell_state"
import { constants } from "./constants"
import { exampleGrowthFunction, GrowthFunction, RangeGrowthFunction } from "./growth_function"
import { GenericKernel, Kernel, minimumNeighbourKernel } from "./kernel"
import { Model } from "./model"
import { P5Drawer } from "./p5_drawer"

let t = 0
const canvasId = "canvas"
const fieldSize = constants.simulation.worldSize
const cellSize = constants.simulation.cellSize
const modelSize = Math.floor(fieldSize / cellSize)

const givenRule = ((): { kernel: Kernel, growthFunction: GrowthFunction } | null => {
  if (constants.parameters.kernel == null) {
    return null
  }
  if (constants.parameters.growthFunction == null) {
    return null
  }
  try {
    const ranges = RangeGrowthFunction.parseRanges(constants.parameters.growthFunction)
    return {
      kernel: new GenericKernel(constants.parameters.kernel),
      growthFunction: new RangeGrowthFunction(ranges),
    }
  } catch (error) {
    alert(`growth_function parse error: ${error}`)
    return null
  }
})()

const kernel = givenRule?.kernel ?? minimumNeighbourKernel
const growthFunction = givenRule?.growthFunction ?? exampleGrowthFunction

console.log(`kernel: ${kernel.weights}`)
// console.log(`growth function:\n${}`) // TODO:

const model = new Model(
  modelSize,
  kernel,
  growthFunction,
)

model.initialize(size => {
  const states: CellState[][] = []

  for (let y = 0; y < size; y += 1) {
    const row: CellState[] = []
    states.push(row)

    for (let x = 0; x < size; x += 1) {
      if (random(1) < constants.parameters.initialAliveRatio) {
        row.push(0)
      } else {
        row.push(1)
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
    if ((t % 1000) === 0) {
      console.log(`t: ${t}`)
    }

    if ((t % constants.simulation.calculationSpeed) !== 0) {
      t += 1
      return
    }

    model.step(1)

    drawer.drawCanvas()
    drawer.drawModel(model)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
