import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Drawer } from "./drawer"
import { exampleRules } from "../drawer/rule_examples"
import { Vector } from "../../classes/physics"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"

const canvasId = "canvas"
const fieldSize = new Vector(600, 600) // TODO: 決める
const rules = exampleRules.flatMap(rule => {
  try {
    return new VanillaLSystemRule(rule)
  } catch (e) {
    console.log(`${e} (${rule})`)
    return []
  }
})
const drawer = new Drawer(fieldSize, rules)

export const canvasWidth = fieldSize

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0x0, 0xFF)
  }

  p.draw = () => {
    drawer.next(p)
  }
}
