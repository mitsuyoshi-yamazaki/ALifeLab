import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { constants } from "./constants"
import { P5Drawer } from "./p5_drawer"
import { TerrainState, TerrainStateEnergySource } from "./terrain"
import { World } from "./world"

let t = 0
const canvasId = "canvas"
const cellSize = constants.simulation.cellSize
const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
const fieldSize = worldSize.mult(cellSize)

export const main = (p: p5): void => {
  const world = new World(worldSize, initializeTerrain(), [])
  const drawer = new P5Drawer(p, cellSize)
  
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

const initializeTerrain = (): TerrainState[][] => {
  const result: TerrainState[][] = []

  for (let y = 0; y < worldSize.y; y += 1) {
    const row: TerrainState[] = []
    result.push(row)

    for (let x = 0; x < worldSize.x; x += 1) {
      row.push({
        case: "plain",
        energy: 0,
      })
    }
  }

  const energySource: TerrainStateEnergySource = {
    case: "energy source",
    production: 10,
  }
  const center = worldSize.div(2)
  result[Math.floor(center.x)][Math.floor(center.y)] = energySource

  return result
}
