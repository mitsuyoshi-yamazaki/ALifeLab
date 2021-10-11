import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Drawer } from "../lines_and_angles/drawer"
import { exampleRules } from "../drawer/rule_examples"
import { toggleFullscreen } from "../../classes/utilities"
import { Vector } from "../../classes/physics"

const canvasId = "canvas"
const fieldSize = new Vector(window.screen.width, window.screen.height) // windowサイズなのでfullscreeen時の画面サイズに合わせる場合はbrowserをフルスクリーンにしておく必要がある
const drawer = new Drawer(fieldSize, exampleRules) // FixMe:

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

    // p.noFill()
    // p.strokeWeight(10)
    // p.stroke(0xff, 0,0)
    // p.rect(10, 10, fieldSize.x - 20, fieldSize.y - 20)
  }

  p.mousePressed = () => {
    toggleFullscreen(canvasId)
  }
}
