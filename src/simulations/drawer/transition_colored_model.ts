import { Vector } from "../../classes/physics"
import { Color } from "../../classes/color"
import { random } from "../../classes/utilities"
import { Action } from "./drawer"
import { Line } from "./line"
import { LSystemRule, LSystemCoordinate } from "./lsystem_rule"
import { Model } from "./model"
import { LSystemDrawer } from "./lsystem_drawer"
import { VanillaLSystemRule } from "./vanilla_lsystem_rule"

export class TransitionColoredModel extends Model {
  protected checkCompleted(): void {
    const completionReason = this.completedReason()
    if (completionReason != null) {
      this._result = this.currentResult(completionReason)
      return
    }
  }

  protected preExecution(): void {
  }

  private completedReason(): string | null {
    if (this._lines.length > this.maxLineCount) {
      return "Filled"
    }
    if (this._drawers.length === 0) {
      return "All died"
    }

    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected newDrawer(position: Vector, direction: number, condition: string, rule: VanillaLSystemRule, lineLengthType: number, colorTheme: string): LSystemDrawer {
    return new TransitionColoredDrawer(
      position,
      direction,
      condition,
      1,
      rule,
      lineLengthType,
      "",
    )
  }

  protected setupFirstDrawers(rules: VanillaLSystemRule[], fixedStartPoint: boolean, lineLengthType: number, colorTheme: string): LSystemDrawer[] {
    if (rules.length > 1) {
      return super.setupFirstDrawers(rules, fixedStartPoint, lineLengthType, colorTheme)
    }

    const rule = rules[0]
    const initialConditions = rule.possibleConditions
    const center = this.fieldSize.div(2)
    const radius = Math.min(this.fieldSize.x, this.fieldSize.y) / 4
    const drawers: LSystemDrawer[] = []

    const position = (index: number): Vector => {
      if (initialConditions.length === 1) {
        return center
      }
      const x = center.x + Math.cos((index * Math.PI * 2) / initialConditions.length) * radius
      const y = center.y + Math.sin((index * Math.PI * 2) / initialConditions.length) * radius
      return new Vector(x, y)
    }

    const randomDirection = (): number => {
      if (fixedStartPoint) {
        return 270
      }
      return random(360) - 180
    }
    const direction = randomDirection()

    for (let i = 0; i < initialConditions.length; i += 1) {
      const initialCondition = initialConditions[i]
      drawers.push(this.newDrawer(position(i), direction, initialCondition, rule, lineLengthType, ""))
    }

    return drawers
  }
}

class TransitionColoredDrawer extends LSystemDrawer {
  private readonly _loopCount = 2

  public constructor(
    position: Vector,
    direction: number,
    condition: string,
    public readonly n: number,
    public readonly rule: VanillaLSystemRule,
    public readonly lineLengthType: number, // TODO: 変化しない引数は引き回さなくて済むような作りにする
    public readonly conditionHistory: string,
  ) {
    super(position, direction, condition, n, rule, lineLengthType, "transition")
  }

  public next(): Action<LSystemDrawer> {
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
    line.color = this.lineColor() ?? Color.white(0x0)

    const sliceIndex = Math.max((this.conditionHistory.length + 1) - this.rule.transition.maxLoopLength * this._loopCount, 0)
    const nextHistory = `${this.conditionHistory}${this._condition}`.slice(sliceIndex)

    const drawerFromCoordinate = (coordinate: LSystemCoordinate): TransitionColoredDrawer => {
      return new TransitionColoredDrawer(
        nextPosition,
        coordinate.direction,
        coordinate.condition,
        this.n + 1,
        this.rule,
        this.lineLengthType,
        nextHistory
      )
    }
    const children: LSystemDrawer[] = this.rule.nextCoordinates(this._condition, this._direction).map(drawerFromCoordinate)
    return new Action(line, children)
  }

  private lineColor(): Color | null {
    const loop = this.rule.loopOf(this._condition, this.conditionHistory, this._loopCount)
    if (loop == null) {
      return null
    }
    return this.rule.transition.colorOf(loop)
  }
}
