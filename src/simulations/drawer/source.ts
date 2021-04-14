import p5 from "p5"
import { Vector } from "../../classes/physics"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { Action, Drawer, LSystemDrawer } from "./drawer"
import { Line, isCollided } from "./object"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
const centerPoint = new Vector(fieldSize / 2, fieldSize / 2)

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("system.size", 600, "s.s")

export const constants = {
  system: {
    fieldSize: new Vector(fieldBaseSize, fieldBaseSize * 0.6),
  },
  simulation: {
    maxDrawerCount: parameters.int("simulation.max_drawer_count", 100, "s.d"),
  },
  draw: {
  },
}

const position = new Vector(centerPoint.x, fieldSize - 100)
const rule = new Map<string, string>()
rule.set("A", "A+B")
rule.set("B", "A")
const ruleConstants = new Map<string, number>()
ruleConstants.set("+", 30)

const direction = 270
const firstDrawer = new LSystemDrawer(position, direction, "A", 1, rule, ruleConstants)
const radian = (360 - direction) * (Math.PI / 180)
const rootLine = new Line(position.moved(radian, 20), position.moved(radian, 0.1))
firstDrawer.currentLine = rootLine
let drawers: Drawer[] = [firstDrawer]
const lines: Line[] = []

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

function isCollidedWithLines(line: Line): boolean {
  return lines.some(other => isCollided(line, other))
}

function drawLines(p: p5, node: Line) {
  node.draw(p)
  node.children.forEach(child => drawLines(p, child))
}
