import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Drawer } from "../la_interactive/drawer"
import { exampleRuleDefinitions } from "../drawer/rule_examples"
import { isFullScreen, toggleFullscreen } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { constants } from "../la_interactive/constants"

const canvasId = "canvas"
const screenSize = new Vector(window.screen.width, window.screen.height)
const isPortrait = ((): boolean => {
  return false  // FixMe: 動的に取得する
})()
const fieldSize = isPortrait ? screenSize : screenSize.transposed // windowサイズなのでfullscreeen時の画面サイズに合わせる場合はbrowserをフルスクリーンにしておく必要がある
const rules = exampleRuleDefinitions.flatMap(ruleDefinition => {
  try {
    const rule = new VanillaLSystemRule(ruleDefinition.rule)
    return {
      name: ruleDefinition.name,
      rule,
      preferredLineCountMultiplier: ruleDefinition.preferredLineCountMultiplier,
    }
  } catch (e) {
    console.log(`${e} (${ruleDefinition.name}: ${ruleDefinition.rule})`)
    return []
  }
})
const maxLineCount = 5000
const drawer = new Drawer(
  fieldSize,
  maxLineCount,
  rules,
)

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

  p.mousePressed = () => {
    if (isFullScreen() !== true) {
      toggleFullscreen(canvasId)
      return
    }

    const position = new Vector(p.mouseX, p.mouseY)
    drawer.didReceiveTouch(position)
  }
}
