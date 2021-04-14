import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
const centerPoint = new Vector(fieldSize / 2, fieldSize / 2)

let drawers: Drawer[] = []
const lines: Line[] = []

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    setupDrawers()

    p.background(0xFF, 0xFF)
  }

  p.draw = () => {
    if (drawers.length < 100) {
      const deads: Drawer[] = []
      const newDrawers: Drawer[] = []
      const newLines: Line[] = []
      drawers.forEach(drawer => {
        const action = drawer.next(p)
        if (isCollidedWithLines(action.line) === true) {
          deads.push(drawer)
        } else {
          newDrawers.push(...action.drawers)
          newLines.push(action.line)
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
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function isCollidedWithLines(line: Line): boolean {
  return lines.some(other => isCollided(line, other))
}

function isCollided(line1: Line, line2: Line): boolean {
  // http://www.jeffreythompson.org/collision-detection/line-line.php

    // calculate the distance to intersection point
  const uA = ((line2.end.x - line2.start.x) * (line1.start.y - line2.start.y)
    - (line2.end.y - line2.start.y) * (line1.start.x - line2.start.x))
    / ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)
      - (line2.end.x - line2.start.x) * (line1.end.y - line1.start.y))
  const uB = ((line1.end.x - line1.start.x) * (line1.start.y - line2.start.y)
    - (line1.end.y - line1.start.y) * (line1.start.x - line2.start.x))
    / ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)
      - (line2.end.x - line2.start.x) * (line1.end.y - line1.start.y))

    // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      // const intersectionX = line1.start.x + (uA * (line1.end.x - line1.start.x))
      // const intersectionY = line1.start.y + (uA * (line1.end.y - line1.start.y))

      return true
    }

  return false
}

class Line {
  public constructor(
    public readonly start: Vector,
    public readonly end: Vector,
    public readonly weight: number,
    public readonly color: Color,
  ) { }

  public draw(p: p5) {
    p.stroke(this.color.p5(p))
    p.strokeWeight(this.weight)
    p.line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}

class Action {
  // tslint:disable-next-line:no-shadowed-variable
  public constructor(public readonly line: Line, public readonly drawers: Drawer[]) { }
}

function setupDrawers() {
  const position = new Vector(centerPoint.x, fieldSize - 100)
  const rule = new Map<string, string>()
  rule.set("A", "A+B")
  rule.set("B", "A")
  const constants = new Map<string, number>()
  constants.set("+", 30)
  const drawer = new LSystemDrawer(position, 270, "A", 1, rule, constants)
  drawers.push(drawer)
}

class Drawer {
  protected _position: Vector
  protected _direction: number

  public constructor(position: Vector, direction: number) {
    this._position = position
    this._direction = direction
  }

  public next(p: p5): Action {
    throw new Error("Not implemented")
  }
}

class LSystemDrawer extends Drawer {
  private _condition: string

  public constructor(
    position: Vector,
    direction: number,
    condition: string,
    public readonly n: number,
    public readonly rule: Map<string, string>,
    public readonly constants: Map<string, number>,
  ) {
    super(position, direction)
    this._condition = condition
  }

  public next(p: p5): Action {
    const length = 40 / this.n
    const weight = 10 / this.n
    const radian = this._direction * (Math.PI / 180)
    const position = this._position.moved(radian, length)
    const line = new Line(this._position, this._position.moved(radian, length - 1), weight, new Color(0x0, 0x0, 0x0, 0x80))

    let newDirection = this._direction

    const nextCondition = this.rule.get(this._condition)
    if (nextCondition == undefined) {
      throw new Error(`Cannot retrieve next condition (current: ${this._condition}, rule: ${String(this.rule)})`)
    }

    const children: LSystemDrawer[] = []

    for (const c of nextCondition) {
      const directionChange = this.constants.get(c)
      if (directionChange != undefined) {
        newDirection += directionChange
        continue
      }

      if (c === this._condition || nextCondition.length === 1) {
        this._condition = c
        this._position = position
        this._direction = newDirection
      } else {
        const child = new LSystemDrawer(position, newDirection, c, this.n + 1, this.rule, this.constants)
        children.push(child)
      }
    }

    return new Action(line, children)
  }
}
