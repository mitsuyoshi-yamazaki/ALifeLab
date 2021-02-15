import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Machine } from "./machine"
import { Bit, Tape } from "./tape"

let t = 0
let machines: Machine[]
const numberOfMachines = 100
const size = 1200
const fieldSize = new Vector(size, Math.floor(size * 0.6))
const initialTape: Bit[] = [0, 0, 0, 0, 0, 0, 0, 0]

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    machines = createMachines()

    p.background(0)
  }

  p.draw = () => {
    t += 1

    machines.forEach(m => m.draw(p))
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
