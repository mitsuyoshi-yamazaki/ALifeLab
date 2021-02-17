import p5 from "p5"
import { random } from "../../classes/utilities"
import { FrictedTerrain } from "../../alife-game-jam/terrain"
import { Vector } from "../../classes/physics"
import { Machine } from "./machine"
import { MachineWorld } from "./machine_world"
import { Bit, Tape } from "./tape"
import { URLParameterParser } from "../../classes/url_parameter_parser"

export const parameterParser = new URLParameterParser()

const DEBUG = parameterParser.boolean("debug", true, "d")
const numberOfMachines = parameterParser.int("number_of_machines", 100, "nm")
const size = parameterParser.int("field_size", 1200, "s")
const temp = parameterParser.int("temp", 10, undefined)

log(`number of machines: ${numberOfMachines}`)

let t = 0
const fieldSize = new Vector(size, Math.floor(size * 0.6))
const initialTape: Bit[] = [0, 0, 0, 0, 0, 1, 0, 1]
const friction = 0.99
const world = new MachineWorld(fieldSize, [new FrictedTerrain(fieldSize, friction)])
world.addMachine(createMachines())
const initialBitStatistics = world.bitStatistics()
log(`[t:${t}] ('0', '1'): (${initialBitStatistics.zero}, ${initialBitStatistics.one})`)

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
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    p.background(0)
  }

  p.draw = () => {
    p.background(0)
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
