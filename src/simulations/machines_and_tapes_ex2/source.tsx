import p5 from "p5"
import { random, toggleFullscreen } from "../../classes/utilities"
import { FrictedTerrain } from "../../alife-game-jam/terrain"
import { Vector } from "../../classes/physics"
import { Machine } from "./machine"
import { MachineWorld } from "./machine_world"
import { Bit, Tape } from "./tape"
import { URLParameterParser } from "../../classes/url_parameter_parser"

export const parameters = new URLParameterParser()

const DEBUG = parameters.boolean("debug", true, "d")
const numberOfMachines = parameters.int("number_of_machines", 200, "nm")
const size = parameters.int("field_size", 800, "s")
const temp = parameters.int("temp", 10, undefined)
const isArtMode = parameters.boolean("art_mode", false, "a")
const isFullscreenEnabled = parameters.boolean("fullscreen", false, "f")

log(`number of machines: ${numberOfMachines}`)

let t = 0
const fieldSize = isFullscreenEnabled ?
  new Vector(window.screen.width, window.screen.height) : new Vector(size, Math.floor(size * 0.6))

const initialTape: Bit[] = [0, 0, 0, 0, 0, 1, 0, 1]
const friction = 0.99
const world = new MachineWorld(fieldSize, [new FrictedTerrain(fieldSize, friction)])
world.addMachine(createMachines())
const initialBitStatistics = world.bitStatistics()
log(`[t:${t}] ('0', '1'): (${initialBitStatistics.zero}, ${initialBitStatistics.one})`)

const canvasId = "canvas"

function log(message: string): void {
  if (DEBUG) {
    console.log(message)
  }
}

export const getTimestamp = (): number => {
  return t
}

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    p.background(0)
  }

  p.draw = () => {
    if (isArtMode === false) {
      p.background(0)
    }
    world.next()
    world.draw(p)

    if (t % 200 === 0) {
      const bitStatistics = world.bitStatistics()
      if (bitStatistics.zero !== initialBitStatistics.zero || bitStatistics.one !== initialBitStatistics.one) {
        log(`[t:${t}] Physics law violation ('0', '1'): (${bitStatistics.zero}, ${bitStatistics.one})`)
      }
    }

    t += 1
  }

  p.mousePressed = () => {
    if (isFullscreenEnabled !== true) {
      return
    }
    toggleFullscreen(canvasId)
  }
}

function createMachines(): Machine[] {
  const result: Machine[] = []
  for (let i = 0; i < numberOfMachines; i += 1) {
    const position = fieldSize.randomized()
    // const tape = new Tape(initialTape)
    const bits: Bit[] = random(1) > 0.5 ? [0, 0, 0, 0, 0] : [1, 0, 1, 0, 1, 0]
    const tape = new Tape(bits)
    result.push(new Machine(position, tape))
  }

  return result
}
