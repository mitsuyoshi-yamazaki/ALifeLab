import p5 from "p5"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("size", 1200, "s")

const debug = parameters.boolean("debug", true, "d")

const fieldSize = new Vector(fieldBaseSize, fieldBaseSize * 0.6)

function log(message: string) {
  if (debug) {
    console.log(message)
  }
}

let t = 0

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    p.background(0, 0xFF)
  }

  p.draw = () => {
    p.background(0, 0xFF)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
