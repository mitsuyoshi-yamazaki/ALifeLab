import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { constants } from "./constants"
import { ColorProfile, DrawableObject, Square } from "./drawable_object"
import { Kaleidoscope } from "./kaleidoscope"

let t = 0
const canvasId = "canvas"
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize)
const kaleidoscopes = createKaleidoscopes()

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
      kaleidoscopes.forEach(kaleidoscope => {
        kaleidoscope.next()
        kaleidoscope.draw(p)
      })
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createKaleidoscopes(): Kaleidoscope[] {
  // const colorProfile = new SimpleColorProfile()  // "cannot access uninitialized variable" error
  const colorProfile: ColorProfile = {
    color: Color.white()
  }
  const objects1: DrawableObject[] = []
  const centerPoint = fieldSize.div(2)
  const angle = constants.simulation.objectSpacing
  const size = constants.simulation.objectSize
  const distance = constants.simulation.objectDistance
  for (let a = 0; a < 360; a += angle) {
    const radian = Math.PI * a / 180
    const x = Math.cos(radian) * distance
    const y = Math.sin(radian) * distance
    objects1.push(new Square(
      Vector.zero(),
      centerPoint.add(new Vector(x, y)),
      0,
      1,
      size
    ))
  }
  
  const objects2: DrawableObject[] = []
  for (let a = -angle / 2; a < 360 - angle / 2; a += angle) {
    const radian = Math.PI * a / 180
    const x = Math.cos(radian) * distance
    const y = Math.sin(radian) * distance
    objects2.push(new Square(
      Vector.zero(),
      centerPoint.add(new Vector(x, y)),
      0,
      1,
      size
    ))
  }

  return [
    new Kaleidoscope(fieldSize, objects1, colorProfile, true),
    new Kaleidoscope(fieldSize, objects2, colorProfile, false),
  ]
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