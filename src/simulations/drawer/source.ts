import p5 from "p5"
import { Vector } from "../../classes/physics"
import { constants } from "./constants"
import { Drawer, LSystemDrawer } from "./drawer"
import { Line, isCollided } from "./line"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
const centerPoint = new Vector(fieldSize / 2, fieldSize / 2)

const firstDrawer = setupFirstDrawer()
let drawers: Drawer[] = [firstDrawer]
const lines: Line[] = []
const rootLine = setupRootLine()
firstDrawer.currentLine = rootLine

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    p.background(0xFF, 0xFF)
  }

  p.draw = () => {
    if (drawers.length > constants.simulation.maxDrawerCount) {
      return
    }

    p.background(0xFF, 0xFF)

    const deads: Drawer[] = []
    const newDrawers: Drawer[] = []
    const newLines: Line[] = []
    drawers.forEach(drawer => {
      const action = drawer.next()
      if (isCollidedWithLines(action.line) === true) {
        deads.push(drawer)
      } else {
        newDrawers.push(...action.drawers)
        newLines.push(action.line)

        drawer.currentLine?.children.push(action.line)
        drawer.currentLine = action.line
        action.drawers.forEach(d => {
          d.currentLine?.children.push(action.line)
          d.currentLine = action.line
        })
      }
    })

    drawers.push(...newDrawers)
    newLines.forEach(line => {
      line.draw(p)
    })
    lines.push(...newLines)

    drawers = drawers.filter(drawer => {
      return deads.includes(drawer) === false
    })

    drawLines(p, rootLine)

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function setupRootLine(): Line {
  const points: [Vector, Vector][] = []
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      points.push([
        new Vector(i * fieldSize, i * fieldSize),
        new Vector(j * fieldSize, ((j + 1) % 2) * fieldSize),
      ])
    }
  }

  let root: Line | undefined
  let parent: Line | undefined
  points.forEach(p => {
    const line = new Line(p[0], p[1])
    line.fixedWeight = 4
    line.isHidden = !constants.draw.showBorderLine

    if (root == undefined) {
      root = line
    }
    parent?.children.push(line)
    lines.push(line)
    parent = line
  })
  if (root == undefined) {
    throw new Error()
  }

  return root
}

function setupFirstDrawer(): Drawer {
  const position = new Vector(centerPoint.x, fieldSize - 100)
  const rule = new Map<string, string>()
  rule.set("A", "A+B")
  rule.set("B", "A")
  const ruleConstants = new Map<string, number>()
  ruleConstants.set("+", 30)

  const direction = 270

  return new LSystemDrawer(position, direction, "A", 1, rule, ruleConstants)
}

function isCollidedWithLines(line: Line): boolean {
  if (constants.simulation.lineCollisionEnabled === false) {
    return false
  }

  return lines.some(other => isCollided(line, other))
}

function drawLines(p: p5, node: Line) {
  node.draw(p)
  node.children.forEach(child => drawLines(p, child))
}
