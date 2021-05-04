import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/default_canvas_parent_id"
import { Vector } from "../../classes/physics"
import { constants } from "./constants"
import { AutoSearch, AutoSearchConfig } from "./autosearch"
import { Model } from "./model"

let t = 0
const canvasId = "canvas"
const fieldSize = new Vector(constants.system.fieldSize, constants.system.fieldSize)
const autoSearch = createAutoSearch()

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    if (t % constants.simulation.executionInterval === 0) {
      p.background(0, 0xFF)

      autoSearch.next()
      autoSearch.draw(p)
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function createAutoSearch(): AutoSearch {
  const config: AutoSearchConfig = {
    fieldSize,
    cellSize: constants.simulation.cellSize,
  }
  return new AutoSearch(config)
}