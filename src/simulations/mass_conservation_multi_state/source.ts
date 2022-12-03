import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { P5Drawer } from "./p5_drawer"
import { CellState, World } from "./world"
import { constants } from "./constants"
import { ScreenshotDownloader } from "../../classes/downloader"
import { distanceTransform } from "./distance_transform"

let t = 0
const canvasId = "canvas"
const cellSize = constants.simulation.cellSize
const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
const fieldSize = worldSize.mult(cellSize)
const downloader = new ScreenshotDownloader()

export const main = (p: p5): void => {
  const world = new World(worldSize, initializeStates())
  const drawer = new P5Drawer(p, cellSize)
  log(`total mass: ${totalMass(world.cells.flatMap(x => x))}`)

  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    world.calculate()
    log(`total mass: ${totalMass(world.cells.flatMap(x => x))}`)

    drawer.drawCanvas()
    drawer.drawWorld(world)

    if (constants.simulation.enableStripeDetection === true) {
      drawer.drawDistanceTransform(distanceTransform(world.cells, world.size))
    }

    if (constants.simulation.autoDownload != null && (t % constants.simulation.autoDownload) === 0) {
      downloader.saveScreenshot(t)
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

const initializeStates = (): CellState[][] => {
  const blueMaximumPressure = 1000
  const redMaximumPressure = blueMaximumPressure
  const result: CellState[][] = []

  for (let y = 0; y < worldSize.y; y += 1) {
    const row: CellState[] = []
    result.push(row)

    for (let x = 0; x < worldSize.x; x += 1) {
      
      row.push({
        substances: {
          blue: Math.floor(random(blueMaximumPressure)),
          red: Math.floor(random(redMaximumPressure)),
        }
      })
    }
  }

  return result
}

const totalMass = (cells: CellState[]): number => {
  return cells.reduce((result, current) => {
    return result + Object.values(current.substances).reduce((r, c) => r + c, 0)
  }, 0)
}

const log = (message: string): void => {
  if (constants.system.debug) {
    console.log(message)
  }
}
