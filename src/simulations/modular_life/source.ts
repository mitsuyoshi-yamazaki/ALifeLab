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
import { PhysicsRule } from "./physics"
import { LifeStatistics } from "./statistics"

let t = 0
const logger = new Logger()
logger.enabled = true
logger.logLevel = constants.system.logLevel

const frameSkip = constants.simulation.frameSkip
const statisticsUpdateInterval = frameSkip * 100
let lifeStatisticsStatus = ""
const lifeStatistics = new LifeStatistics(logger)

const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
const cellSize = constants.simulation.cellSize
const worldDrawSize = worldSize.mult(cellSize)
const canvasSize = new Vector(worldDrawSize.x * 2, worldDrawSize.y)
const physicsRule: PhysicsRule = {
  heatLoss: constants.physics.heatLoss,
  energyHeatConversion: constants.physics.energyHeatConversion,
  heatDamageRatio: constants.physics.heatDamageRatio,
  harvestEnergyConversionRate: constants.physics.harvestEnergyConversionRate,
}

export const main = (p: p5): void => {
  const world = new World(worldSize, logger, lifeStatistics, physicsRule)
  initializeEnergySources(world)
  initializeLives(world)
  const canvasDrawer = new P5Drawer(p, cellSize, Vector.zero())
  const worldDrawer = new P5Drawer(p, cellSize, Vector.zero())
  const heatDrawer = new P5Drawer(p, cellSize, new Vector(worldSize.x * cellSize, 0))

  p.setup = () => {
    const canvas = p.createCanvas(canvasSize.x, canvasSize.y)
    canvas.id("canvas")
    canvas.parent(defaultCanvasParentId)
  }

  p.draw = () => {
    if (t % frameSkip === 0) {
      world.run(1)
    }

    if (t % statisticsUpdateInterval === 0) {
      lifeStatisticsStatus = lifeStatisticsDescription(world.t)
      lifeStatistics.trimExtinctFamilyLines(5)
    }
      
    p.clear()
    worldDrawer.drawEnergyAmount(world.terrain)
    worldDrawer.drawLives(world.lives)
    heatDrawer.drawHeatMap(world.terrain)
    canvasDrawer.drawStatus(canvasSize, `v:${System.version}\n${world.t}\n${world.lives.length} lives\n\n${lifeStatisticsStatus}`)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

const initializeEnergySources = (world: World): void => {
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

const initializeLives = (world: World): void => {
  world.addAncestor(createAncestor(createFloraCode(NeighbourDirections.left)), worldSize.div(2).floor())
}

const lifeStatisticsDescription = (t: number): string => {
  const longestLivedLife = lifeStatistics.getLongestLivedLifeAt(t)
  if (longestLivedLife == null) {
    return ""
  }

  const descriptions: string[] = [
    "longest lifetime:",
    `ID: ${longestLivedLife.id}, ancestor: ${longestLivedLife.ancestorId}`,
    `lifetime: ${longestLivedLife.lifetime}`,
  ]

  return descriptions.join("\n")
}
