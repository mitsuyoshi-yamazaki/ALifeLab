import p5 from "p5"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { Vector } from "../../classes/physics"
import { Color } from "../../classes/color"
import { Atom, Shape } from "./atom"
import { Drawer, SimpleDrawer } from "./drawer"

let t = 0
const canvasId = "canvas"
const fieldSize = new Vector(600, 600)

const drawer: Drawer = new SimpleDrawer(new Color(0xFF, 0, 0, 0xFF))
const atoms = ((): Atom[] => {
  const results: Atom[] = []
  const numberOfAtoms = 100

  const getRandomShape = ((): Shape => {
    return {
      case: "circle",
      diameter: 40,
    }
  })

  for (let i = 0; i < numberOfAtoms; i += 1) {
    results.push({
      position: fieldSize.randomized(),
      shape: getRandomShape(),
    })
  }

  return results
})()

console.log(`${atoms.length} atoms ${atoms[0].position}`)

export const main = (p: p5): void => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent(defaultCanvasParentId)

    p.background(0, 0xFF)
  }

  p.draw = () => {
    p.background(0, 0xFF)

    drawer.draw(p, atoms)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}
