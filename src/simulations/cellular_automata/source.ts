import p5 from "p5"
import { Vector } from "../../classes/physics"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { constants } from "./constants"
import { Model } from "./model"
import { isPresetRule, Rule } from "./rule"
import { SimpleBubbleRule } from "./rules/simple_bubble_rule"
import { SimpleMembraneRule } from "./rules/simple_membrane_rule"
import { SimpleDropletRule } from "./rules/simple_droplet_rule"
import { BinaryColorPalette } from "./color_palette"
import { ChemicalCharacteristicRule } from "./rules/chemical_characteristic_rule"

let t = 1
const canvasId = "canvas"
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize)
const model = createModel()

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
    model.draw(p, constants.simulation.cellSize)  // 初期状態を描画
  }

  p.draw = () => {
    if (t % constants.simulation.executionInterval === 0) {
      p.background(0, 0xFF)
      model.next()
      model.draw(p, constants.simulation.cellSize)
    }
    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createModel(): Model {
  const cellSize = constants.simulation.cellSize
  const automatonSize = new Vector(Math.floor(fieldSize.x / cellSize), Math.floor(fieldSize.y / ((cellSize * Math.sqrt(3)) / 2)))
  const rule = createRule()
  return new Model(automatonSize, rule, constants.simulation.initialState)
}

function createRule(): Rule {
  if (isPresetRule(constants.simulation.presetRule)) {
    switch (constants.simulation.presetRule) {
    case "bubble":
      return createSimpleBubbleRule()
      
    case "membrane":
      return createSimpleMembraneRule()
      
    case "droplet":
      return createSimpleDropletRule()
      
    case "CC":
      return createCCRule()
    }
  } else {
    return createSimpleBubbleRule()
  }
}

function createSimpleBubbleRule(): Rule {
  return new SimpleBubbleRule(constants.simulation.radius, new BinaryColorPalette())
}

function createSimpleMembraneRule(): Rule {
  return new SimpleMembraneRule(constants.simulation.radius)
}

function createSimpleDropletRule(): Rule {
  return new SimpleDropletRule(constants.simulation.radius)
}

function createCCRule(): Rule {
  return new ChemicalCharacteristicRule(constants.simulation.radius)
}
