import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { constants } from "./constants"
import { Logger } from "./logger"
import { P5Drawer } from "./p5_drawer"
import { World } from "./world"

let t = 0
const logger = new Logger()
logger.enabled = true
logger.logLevel = constants.system.logLevel

const frameSkip = constants.simulation.frameSkip

const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
const cellSize = constants.simulation.cellSize
const worldDrawSize = worldSize.mult(cellSize)
const canvasSize = new Vector(worldDrawSize.x * 2, worldDrawSize.y)
const world = new World(worldSize, logger)

export const main = (p: p5): void => {
  const drawer = new P5Drawer(p, cellSize)

  p.setup = () => {
    const canvas = p.createCanvas(canvasSize.x, canvasSize.y)
    canvas.id("canvas")
    canvas.parent(defaultCanvasParentId)
  }

  p.draw = () => {
    if (t % frameSkip === 0) {
      world.run(1)
    }
      
    p.clear()
    drawer.drawWorld(world)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
