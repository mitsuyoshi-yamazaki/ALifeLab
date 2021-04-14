import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
const centerPoint = new Vector(fieldSize / 2, fieldSize / 2)

const drawers: Drawer[] = []
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
      const newDrawers: Drawer[] = []
      const newLines: Line[] = []
      drawers.forEach(drawer => {
        const action = drawer.next(p)
        newDrawers.push(...action.drawers)
        newLines.push(...action.lines)
      })

      drawers.push(...newDrawers)
      newLines.forEach(line => {
        line.draw(p)
      })
      lines.push(...newLines)
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
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
  public constructor(public readonly lines: Line[], public readonly drawers: Drawer[]) { }
}

function setupDrawers() {
  const rule = new Map<string, string>()
  rule.set("A", "A+B")
  rule.set("B", "A")
  const constants = new Map<string, number>()
  constants.set("+", 30)
  const drawer = new LSystemDrawer(centerPoint, Math.PI / 2, "A", rule, constants)
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
    public readonly rule: Map<string, string>,
    public readonly constants: Map<string, number>,
  ) {
    super(position, direction)
    this._condition = condition
  }

  public next(p: p5): Action {
    const length = 20
    const radian = this._direction * (Math.PI / 180)
    const position = this._position.moved(radian, length)
    const line = new Line(this._position, position, 0.5, new Color(0x0, 0x0, 0x0, 0x80))

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
        const child = new LSystemDrawer(position, newDirection, c, this.rule, this.constants)
        children.push(child)
      }
    }

    return new Action([line], children)
  }
}
