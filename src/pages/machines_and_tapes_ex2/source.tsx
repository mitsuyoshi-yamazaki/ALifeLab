import p5 from "p5"
import { Terrain, FrictedTerrain } from "../../alife-game-jam/terrain"
import { Vector } from "../../classes/physics"
import { Machine } from "./machine"
import { MachineWorld } from "./machine_world"
import { Bit, Tape } from "./tape"

let t = 0
const numberOfMachines = 100
const size = 1200
const fieldSize = new Vector(size, Math.floor(size * 0.6))
const initialTape: Bit[] = [0, 0, 0, 0, 0, 0, 0, 0]
const friction = 0.99
const world = new MachineWorld(fieldSize, [new FrictedTerrain(fieldSize, friction)])
world.addMachine(createMachines())

export const getTimestamp = (): number => {
  return t
}

const main = (p: p5) => {
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
    t += 1
  }
}

function createMachines(): Machine[] {
  const result: Machine[] = []
  for (let i = 0; i < numberOfMachines; i += 1) {
    const position = fieldSize.randomized()
    const tape = new Tape(initialTape)
    result.push(new Machine(position, tape))
  }

  return result
}

const sketch = new p5(main)
