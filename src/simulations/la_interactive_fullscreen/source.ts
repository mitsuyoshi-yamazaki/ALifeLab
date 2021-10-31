import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Drawer } from "../la_interactive/drawer"
import { exampleRuleDefinitions } from "../drawer/rule_examples"
import { isFullScreen, toggleFullscreen } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { constants } from "../la_interactive/constants"

const canvasId = "canvas"
const fieldSize = ((): Vector => {
  if (constants.fullscreen !== true) {
    return new Vector(1000, 1000)
  }
  const screenSize = new Vector(window.screen.width, window.screen.height)
  const isPortrait = ((): boolean => {
    return false  // FixMe: 動的に取得する
  })()
  if (isPortrait === true) {
    return screenSize
  } else {
    return screenSize.transposed
  }
})()
const excludedRuleNames: string[] = [
  // 描画時間が長い
  "落書き",
  // "星",  // 跳ね返りがあるためやはり含める

  // 模様が小さく干渉しにくい
  "Caduceus1",
  "Caduceus2",
  "Caduceus3",
  "Caduceus4",
]
const rules = exampleRuleDefinitions.flatMap(ruleDefinition => {
  if (excludedRuleNames.includes(ruleDefinition.name) === true) {
    return []
  }
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
  {
    ruleType: "examples",
    ruleDefinitions: rules,
  },
  true,
)

let tappedTimestamp = Date.now()

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
    if (constants.fullscreen === true && isFullScreen() !== true) {
      toggleFullscreen(canvasId)
      return
    }

    const now = Date.now()
    if (now - tappedTimestamp < 500) {
      return  // iPadでのチャタリング対策
    }
    tappedTimestamp = now

    const position = new Vector(p.mouseX, p.mouseY)
    drawer.didReceiveTouch(position)
  }
}
