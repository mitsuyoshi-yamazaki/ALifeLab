import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/default_canvas_parent_id"
import { constants } from "./constants"
import { ColorProfile, DrawableObject, Square } from "./drawable_object"
import { Kaleidoscope } from "./kaleidoscope"

let t = 0
const canvasId = "canvas"
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize)
const kaleidoscope = createKaleidoscope()

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.rectMode(p.CENTER)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    if (t % constants.simulation.executionInterval === 0) {
      p.background(0, 0xFF)
      kaleidoscope.next()
      kaleidoscope.draw(p)
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createKaleidoscope(): Kaleidoscope {
  // const colorProfile = new SimpleColorProfile()  // "cannot access uninitialized variable" error
  const colorProfile: ColorProfile = {
    color: Color.white()
  }
  const objects: DrawableObject[] = []
  const centerPoint = fieldSize.div(2)
  const angle = 60
  const size = 100
  const distance = size * 0.6
  for (let a = 0; a < 360; a += angle) {
    const x = Math.cos(a) * distance
    const y = Math.sin(a) * distance
    objects.push(new Square(
      Vector.zero(),
      centerPoint.add(new Vector(x, y)),
      0,
      1,
      size
    ))
  }
  
  return new Kaleidoscope(fieldSize, objects, colorProfile)
}

class SimpleColorProfile implements ColorProfile {
  public get color(): Color {
    const white = 0x7F + Math.abs((this._t % 0x100) - 0x80)
    return Color.white(white)
  }
  
  private _t = 0

  public set(t: number): void {
    this._t = t
  }
}