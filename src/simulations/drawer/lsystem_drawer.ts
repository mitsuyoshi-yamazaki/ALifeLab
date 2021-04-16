import { Vector } from "../../classes/physics"
import { Drawer, Action } from "./drawer"
import { Line } from "./line"

export type LSystemCondition = string | number

export class LSystemRule {
  private map = new Map<string, LSystemCondition[]>()

  /*
   * Encoding:
     * <condition>:<next conditions>;<condition>:<next conditions>,...
       * condition: string
       * next condition: list of string | number
   * Example:
     * A:-30,A,60,B;B:A
   */
  public constructor(public readonly encoded: string) {
    this.decode()
  }

  public nextConditions(currentCondition: string): LSystemCondition[] {
    const nextConditions = this.map.get(currentCondition)
    if (nextConditions == undefined) {
      throw new Error(`Invalid condition ${currentCondition} (rule: ${this.encoded})`)
    }

    return nextConditions
  }

  private decode() {
    this.map.clear()
    this.encoded.split(';').forEach(pair => {
      const keyValue = pair.split(':')
      if (keyValue.length !== 2) {
        throw new Error(`Invalid condition: next-condition pair ${pair}`)
      }
      const condition = keyValue[0]
      const nextConditions = keyValue[1].split(',').map((stringValue: string): LSystemCondition => {
        const numberValue = parseInt(stringValue, 10)
        if (isNaN(numberValue) === true) {
          if (stringValue.length <= 0) {
            throw new Error(`Invalid condition: empty string ${pair}`)
          }

          return stringValue
        }

        return numberValue
      })

      this.map.set(condition, nextConditions)
    })
  }
}

export class LSystemDrawer extends Drawer {
  private _condition: string

  public constructor(
    position: Vector,
    direction: number,
    condition: string,
    public readonly n: number,
    public readonly rule: LSystemRule,
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
    const nextCondition = this.rule.nextConditions(this._condition)
    const children: LSystemDrawer[] = []

    for (const condition of nextCondition) {
      if (typeof(condition) === 'number') {
        newDirection += condition
        continue
      }

      const child = new LSystemDrawer(nextPosition, newDirection, condition, this.n + 1, this.rule, line)
      children.push(child)
    }

    return new Action(line, children)
  }
}
