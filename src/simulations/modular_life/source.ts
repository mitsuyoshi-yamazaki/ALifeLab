import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { createAncestor } from "./ancestor/ancestor"
import { createMoveCode } from "./ancestor/source_code"
import { constants } from "./constants"
import { Directions } from "./direction"
import { EnergySource } from "./energy_source"
import { P5Drawer } from "./p5_drawer"
import { System } from "./system"
import { World } from "./world"
import { worldDelegate } from "./world_delegate"

let t = 0

export const main = (p: p5): void => {
  const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
  const cellSize = constants.simulation.cellSize
  const canvasSize = worldSize.mult(cellSize)
  const drawer = new P5Drawer(p, cellSize)

  const world = new World(worldSize)
  worldDelegate.delegate = world
  initializeEnergySources(world)
  initializeLives(world)

  p.setup = () => {
    const canvas = p.createCanvas(canvasSize.x, canvasSize.y)
    canvas.id("canvas")
    canvas.parent(defaultCanvasParentId)
  }

  p.draw = () => {
    world.run(1)
      
    drawer.drawCanvas()
    drawer.drawWorld(world, cellSize)
    drawer.drawStatus(canvasSize, `${System.version}\n${world.t}`)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

const initializeEnergySources = (world: World): void => {
  world.addEnergySource(new EnergySource(world.size.div(4), 1000))
  world.addEnergySource(new EnergySource(world.size.div(4).mult(3), 5000))
}

const initializeLives = (world: World): void => {
  world.addLife(createAncestor(createMoveCode(Directions.right)))
}