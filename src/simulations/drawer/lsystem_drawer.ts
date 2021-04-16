import { Vector } from "../../classes/physics"
import { Drawer, Action } from "./drawer"
import { Line } from "./line"

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

function parseRules(raw: string | undefined): Map<string, string> {
  const map = new Map<string, string>()
  if (raw == undefined) {
    console.log(`No rule specified`)
    map.set("A", "-A++A")

    return map
  }
  const rawRuleSet = raw.split(",")
  rawRuleSet.forEach(line => {
    const keyValue = line.split(":")
    if (keyValue.length !== 2) {
      console.log(`[Warning] Parameter "rules" line "${line}" should be "<character>:<string>"`)

      return
    }
    map.set(keyValue[0], keyValue[1])
  })

  return map
}

function parseConstants(raw: string | undefined): Map<string, number> {
  const map = new Map<string, number>()
  if (raw == undefined) {
    console.log(`No constant specified`)
    map.set("+", 20)
    map.set("-", -20)

    return map
  }
  const rawRuleSet = raw.split(",")
  rawRuleSet.forEach(line => {
    const keyValue = line.split(":")
    if (keyValue.length !== 2) {
      console.log(`[Warning] Parameter "constants" line "${line}" should be "<character>:<number>"`)

      return
    }
    const angle = parseInt(keyValue[1], 10)
    if (angle === undefined) {
      console.log(`[Warning] Parameter "constants" line "${line}" should be "<character>:<number>"`)

      return
    }
    map.set(keyValue[0], angle)
  })

  return map
}
