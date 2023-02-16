import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { createAncestor } from "./ancestor/ancestor"
import { createFloraCode } from "./ancestor/source_code"
import { constants } from "./constants"
import { NeighbourDirections } from "./primitive/direction"
import { Logger } from "./logger"
import { P5Drawer } from "./p5_drawer"
import { System } from "./system"
import { World } from "./world"
import { Sunlight } from "./world_object/sunlight"

let t = 0
const logger = new Logger()
logger.enabled = true
logger.logLevel = constants.system.logLevel

const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
const cellSize = constants.simulation.cellSize
const canvasSize = worldSize.mult(cellSize)

export const main = (p: p5): void => {
  const world = new World(worldSize, logger)
  initializeEnergySources(world)
  initializeLives(world)
  const drawer = new P5Drawer(p, cellSize)

  p.setup = () => {
    const canvas = p.createCanvas(canvasSize.x, canvasSize.y)
    canvas.id("canvas")
    canvas.parent(defaultCanvasParentId)
  }

  p.draw = () => {
    if (t % constants.simulation.frameSkip === 0) {
      world.run(1)
    }
      
    drawer.drawCanvas()
    drawer.drawWorld(world, cellSize)
    drawer.drawStatus(canvasSize, `v:${System.version}\n${world.t}`)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

const initializeEnergySources = (world: World): void => {
  const fourth = world.size.div(4).floor()

  for (let y = fourth.y; y < world.size.y - fourth.y; y += 1) {
    for (let x = fourth.x; x < world.size.x - fourth.x; x += 1) {
      world.addEnergySource(new Sunlight(new Vector(x, y), 100))
    }
  }
}

const initializeLives = (world: World): void => {
  // world.addLife(createAncestor(createMoveCode(NeighbourDirections.right)), worldSize.div(2))
  world.addLife(createAncestor(createFloraCode(NeighbourDirections.left)), worldSize.div(2))
}