import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Drawer } from "./drawer"
import { exampleRules } from "../drawer/rule_examples"
import { Vector } from "../../classes/physics"

const canvasId = "canvas"
const fieldSize = 600 // TODO: 決める
const drawer = new Drawer(new Vector(fieldSize, fieldSize), exampleRules)

export const canvasWidth = fieldSize

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0x0, 0xFF)
  }

  p.draw = () => {
    drawer.next(p)
  }
}
