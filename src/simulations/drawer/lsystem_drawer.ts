import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { Drawer, Action } from "./drawer"
import { Line } from "./line"
import { LSystemRule } from "./lsystem_rule"

export class LSystemDrawer extends Drawer {
  private _condition: string

  public constructor(
    position: Vector,
    direction: number,
    condition: string,
    public readonly n: number,
    public readonly rule: LSystemRule,
    public readonly lineLengthType: number,
  ) {
    super(position, direction)
    this._condition = condition
  }

  public next(): Action {
    let length = 1
    if (this.lineLengthType === 1) {
      length = 10
    } else if (this.lineLengthType === 2) {
      length = 10 * this.n / (this.n + Math.pow(this.n, 0.5))
    } else {
      length = 40 / Math.pow(this.n, 0.5)
    }
    const radian = this._direction * (Math.PI / 180)
    const nextPosition = this._position.moved(radian, length)
    const line = new Line(this._position, nextPosition)

    let newDirection = this._direction
    const nextCondition = this.rule.nextConditions(this._condition)
    const children: LSystemDrawer[] = []

    for (const condition of nextCondition) {
      if (typeof(condition) === "number") {
        newDirection += condition
        continue
      }

      const child = new LSystemDrawer(nextPosition, newDirection, condition, this.n + 1, this.rule, this.lineLengthType)
      children.push(child)
    }

    return new Action(line, children)
  }

  public mutated(): LSystemDrawer {
    const index = Math.floor(random(this.rule.possibleConditions.length))
    const condition = this.rule.possibleConditions[index]

    return new LSystemDrawer(
      this._position,
      this._direction,
      condition,
      this.n,
      this.rule,
      this.lineLengthType
    )
  }
}
