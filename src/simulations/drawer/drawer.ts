import { Vector } from "../../classes/physics"
import { Line } from "./line"

export class Action {
  public constructor(public readonly line: Line, public readonly drawers: Drawer[]) { }
}

export class Drawer {
  protected _position: Vector
  protected _direction: number

  public constructor(position: Vector, direction: number, public readonly parentLine: Line) {
    this._position = position
    this._direction = direction
  }

  public next(): Action {
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
    public readonly parentLine: Line,
  ) {
    super(position, direction, parentLine)
    this._condition = condition
  }

  public next(): Action {
    const length = 40 / Math.pow(this.n, 0.5)
    const radian = this._direction * (Math.PI / 180)
    const nextPosition = this._position.moved(radian, length)
    const line = new Line(this._position, nextPosition)

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

      const child = new LSystemDrawer(nextPosition, newDirection, c, this.n + 1, this.rule, this.constants, line)
      children.push(child)
    }

    return new Action(line, children)
  }
}
