import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Ancestor } from "./ancestor/ancestor"
import { AncestorCode } from "./ancestor/source_code"
import { constants } from "./constants"
import { Logger } from "./logger"
import { P5Drawer } from "./p5_drawer"
import { NeighbourDirections } from "./physics/direction"
import { System } from "./system"
import { World } from "./world"

type UserInputEventShowEnergy = {
  readonly case: "show energy"
  readonly show: boolean
}
type UserInputEventShowHeat = {
  readonly case: "show heat"
  readonly show: boolean
}
type UserInputEventRun = {
  readonly case: "run"
  readonly running: boolean
}
type UserInputEvent = UserInputEventShowEnergy | UserInputEventShowHeat | UserInputEventRun

type ReactConnector = {
  p: (p: p5) => void
  eventHandler: (event: UserInputEvent) => void
  getTimestamp: () => number
}

let t = 0
const logger = new Logger()
logger.enabled = true
logger.logLevel = constants.system.logLevel

const frameSkip = constants.simulation.frameSkip

const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
const cellSize = constants.simulation.cellSize
const canvasSize = worldSize.mult(cellSize)

const world = new World(worldSize, logger, constants.physicalConstant)
initializeEnergySources(world)
initializeAncestors(world)

const drawer = new P5Drawer(cellSize)
drawer.setDrawMode({ case: "material" })
drawer.setDrawMode({ case: "life" })

export const main = (): ReactConnector => {
  let isRunning = true

  return {
    p: ((p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(canvasSize.x, canvasSize.y)
        canvas.id("canvas")
        canvas.parent(defaultCanvasParentId)
      }

      p.draw = () => {
        p.clear()

        if (isRunning !== true) {
          drawer.drawWorld(p, world)
          return
        }

        if (t % frameSkip === 0) {
          world.run(1)
        }

        drawer.drawWorld(p, world)
        drawer.setDrawMode({
          case: "status",
          text: `v:${System.version}\n${world.t}`,
        })

        t += 1
      }
    }),
    eventHandler: ((event: UserInputEvent): void => {
      switch (event.case) {
      case "run":
        isRunning = event.running
        break
      case "show energy":
        if (event.show === true) {
          drawer.setDrawMode({
            case: "energy",
          })
        } else {
          drawer.removeDrawMode("energy")
        }
        break
      case "show heat":
        if (event.show === true) {
          drawer.setDrawMode({
            case: "heat",
          })
        } else {
          drawer.removeDrawMode("heat")
        }
        break
      }
    }),
    getTimestamp: (): number => {
      return t
    }
  }  
}

function initializeEnergySources(world: World): void {
  const centerPosition = world.size.div(2).floor()
  const energyProductionRadius = Math.floor(world.size.x * 0.3)
  const maxEnergyProduction = 10

  const minimumEnergyProductionPosition = Math.floor(world.size.x / 2 - energyProductionRadius)
  const maximumEnergyProductionPosition = world.size.x - minimumEnergyProductionPosition

  for (let y = minimumEnergyProductionPosition; y < maximumEnergyProductionPosition; y += 1) {
    for (let x = minimumEnergyProductionPosition; x < maximumEnergyProductionPosition; x += 1) {
      const distanceToCenter = (new Vector(x, y)).dist(centerPosition)
      const closenessToCenter = 1 - (distanceToCenter / energyProductionRadius)
      const energyProduction = Math.floor(closenessToCenter * maxEnergyProduction)
      world.setEnergyProductionAt(x, y, energyProduction)
    }
  }
}

function initializeAncestors(world: World): void {
  world.addAncestor(Ancestor.minimum(AncestorCode.moveCode(NeighbourDirections.right, 10)), world.size.div(3).floor())
  world.addAncestor(Ancestor.test(AncestorCode.stillCode()), world.size.div(2).floor())
  world.addAncestor(Ancestor.minimum(AncestorCode.moveCode(NeighbourDirections.bottom, 11)), world.size.div(3).mult(2).floor())
}
