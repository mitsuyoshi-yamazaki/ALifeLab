import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { createAncestor } from "./ancestor/ancestor"
import { stillCode } from "./ancestor/source_code"
import { constants } from "./constants"
import { P5Drawer } from "./p5_drawer"
import { World } from "./world"

let t = 0

export const main = (p: p5): void => {
  const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
  const cellSize = constants.simulation.cellSize
  const canvasSize = worldSize.mult(cellSize)
  const drawer = new P5Drawer(p, cellSize)

  const world = new World(worldSize)
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

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

const initializeLives = (world: World): void => {
  world.addLife(createAncestor(stillCode), world.size.div(2))
}