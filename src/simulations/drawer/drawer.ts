import p5 from "p5"
import { Color } from "../../classes/color"
import { Vector } from "../../classes/physics"
import { Line } from "./object"

export class Action {
  public constructor(public readonly line: Line, public readonly drawers: Drawer[]) { }
}

export class Drawer {
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

export class LSystemDrawer extends Drawer {
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
