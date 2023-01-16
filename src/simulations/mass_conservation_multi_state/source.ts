import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { P5Drawer } from "./p5_drawer"
import { CellState, World } from "./world"
import { constants } from "./constants"
import { ScreenshotDownloader } from "../../classes/downloader"
import { distanceTransform, DistanceTransformResult } from "./distance_transform"

type ExecutionModeNormal = {
  readonly case: "normal"
}
type ExecutionModeAutomaticStripeDetection = {
  readonly case: "auto stripe detection"
  finished: boolean
  readonly parameterIndices: {
    sameSubstancePressure: number
    differentSubstancePressure: number
    densityPressure: number
  }
  distanceTransformResults: DistanceTransformResult[][] | null
}
type ExecutionModeStripeDetection = {
  readonly case: "stripe detection"
}
type ExecutionMode = ExecutionModeNormal
  | ExecutionModeAutomaticStripeDetection
  | ExecutionModeStripeDetection

let t = 0
const canvasId = "canvas"
const automaticParameterSearchMaxIndex = 40
const cellSize = constants.simulation.cellSize
const worldSize = new Vector(constants.simulation.worldSize, constants.simulation.worldSize)
const fieldSize = worldSize.mult(cellSize)
const downloader = new ScreenshotDownloader()

const automaticParameterSearchValueFromIndex = (index: number): number => {
  if (index <= 10) {
    return index / 100 // 0.00 ~ 0.10
  } else if (index <= 20) {
    return (index - 10) / 10 // 0.1 ~ 1.0
  } else if (index <= 30) {
    return ((index - 20) / 10) + 1 // 1.1 ~ 2.0
  } else {
    return (index - 30) * 10 // 10 ~ 90
  }
}

const parameterDescription = (): string => {
  const descriptions: string[] = [
    `${constants.parameters.sameSubstancePressureMultiplier}`,
    `${constants.parameters.differentSubstancePressureMultiplier}`,
    `${constants.parameters.densityPressureMultiplier}`,
  ]

  return descriptions.join("_")
}

const executionMode = ((): ExecutionMode => {
  if (constants.simulation.automatic !== true) {
    if (constants.simulation.enableStripeDetection === true) {
      return {
        case: "stripe detection",
      }
    }
    return {
      case: "normal"
    }
  }
  if (constants.simulation.enableStripeDetection === true) {
    constants.parameters.sameSubstancePressureMultiplier = automaticParameterSearchValueFromIndex(0)
    constants.parameters.differentSubstancePressureMultiplier = automaticParameterSearchValueFromIndex(0)
    constants.parameters.densityPressureMultiplier = automaticParameterSearchValueFromIndex(0)
    console.log(`parameters: ${parameterDescription()}`)
    
    return {
      case: "auto stripe detection",
      finished: false,
      parameterIndices: {
        sameSubstancePressure: 0,
        differentSubstancePressure: 0,
        densityPressure: 0,
      },
      distanceTransformResults: null,
    }
  }
  return {
    case: "normal",
  }
})()

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

let world = new World(worldSize, initializeStates())

console.log(`execution mode: ${executionMode.case}`)

export const main = (p: p5): void => {
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

    switch (executionMode.case) {
    case "normal":
      break
    case "stripe detection":
      drawer.drawDistanceTransform(distanceTransform(world.cells, world.size))
      break
    case "auto stripe detection":
      if (t % 200 === 0 && executionMode.finished !== true) {
        const distanceTransformResult = distanceTransform(world.cells, world.size)
        drawer.drawDistanceTransform(distanceTransformResult)

        if (executionMode.distanceTransformResults == null) {
          executionMode.distanceTransformResults = distanceTransformResult
        } else {
          let converged = true;
          (() => {
            for (let y = 0; y < distanceTransformResult.length; y += 1) {
              const row = distanceTransformResult[y]
              for (let x = 0; x < row.length; x += 1) {
                if (row[x].dominantSubstance !== executionMode.distanceTransformResults[y][x].dominantSubstance) {
                  converged = false
                  return
                }
              }
            }
          })()
          executionMode.distanceTransformResults = distanceTransformResult

          if (converged === true) {
            console.log("converged")

            resetAutomaticStripeDetection(executionMode)
            t = 0
          } else {
            console.log("running")
          }
        }
      }
      break
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = executionMode
      break
    }
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

const resetAutomaticStripeDetection = (mode: ExecutionModeAutomaticStripeDetection): void => {
  downloader.saveScreenshot(t, parameterDescription())

  mode.parameterIndices.densityPressure += 1
  if (mode.parameterIndices.densityPressure > automaticParameterSearchMaxIndex) {
    mode.parameterIndices.densityPressure = 0
    mode.parameterIndices.differentSubstancePressure += 1
    if (mode.parameterIndices.differentSubstancePressure > automaticParameterSearchMaxIndex) {
      mode.parameterIndices.differentSubstancePressure = 0
      mode.parameterIndices.sameSubstancePressure += 1
      if (mode.parameterIndices.sameSubstancePressure > automaticParameterSearchMaxIndex) {
        mode.parameterIndices.sameSubstancePressure = 0
        mode.finished = true
      }
    }
  }

  constants.parameters.sameSubstancePressureMultiplier = automaticParameterSearchValueFromIndex(mode.parameterIndices.sameSubstancePressure)
  constants.parameters.differentSubstancePressureMultiplier = automaticParameterSearchValueFromIndex(mode.parameterIndices.differentSubstancePressure)
  constants.parameters.densityPressureMultiplier = automaticParameterSearchValueFromIndex(mode.parameterIndices.densityPressure)
  console.log(`parameters: ${parameterDescription()}`)
  world = new World(worldSize, initializeStates())
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
