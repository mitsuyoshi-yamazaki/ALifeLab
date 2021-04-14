import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random, toggleFullscreen } from "../../classes/utilities"

let t = 0
const canvasId = "canvas"

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(600, 600)
    canvas.id(canvasId)
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
