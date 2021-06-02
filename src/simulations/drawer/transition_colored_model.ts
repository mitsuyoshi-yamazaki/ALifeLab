import { Vector } from "../../classes/physics"
import { Color } from "../../classes/color"
import { Action } from "./drawer"
import { Line } from "./line"
import { LSystemCoordinate } from "./lsystem_rule"
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
      null,
      0,
    )
  }

  public calculateTransition(): void {
    console.log("calculateTransition")
    const leaves: LinkedLine[] = this._lines.filter(line => {
      if (line instanceof LinkedLine) {
        return line.isLeaf
      }
      return false
    }) as LinkedLine[]

    const transitions: string[] = []
    leaves.forEach(line => {
      if (transitions.includes(line.transitions)) {
        return
      }
      transitions.push(line.transitions)
    })
    transitions.sort().forEach(t => console.log(t))
    console.log(`${transitions.length} transitions`)
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
    public readonly parentLine: LinkedLine | null,
    public readonly relativeDirection: number,
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
    const line = new LinkedLine(this.parentLine, this.relativeDirection, this._condition, this._position, nextPosition)
    line.color = this.lineColor() ?? Color.white(0x0)

    const sliceIndex = Math.max((this.conditionHistory.length + 1) - this.rule.transition.maxLoopLength * this._loopCount, 0)
    const nextHistory = `${this.conditionHistory}${this._condition}`//.slice(sliceIndex)

    let isLeaf = true
    const drawerFromCoordinate = (args: [LSystemCoordinate, number]): TransitionColoredDrawer => {
      isLeaf = false
      const coordinate = args[0]
      const direction = args[1]
      return new TransitionColoredDrawer(
        nextPosition,
        coordinate.direction,
        coordinate.condition,
        this.n + 1,
        this.rule,
        this.lineLengthType,
        nextHistory,
        line,
        direction,
      )
    }
    line.isLeaf = isLeaf
    const children: LSystemDrawer[] = this.rule.nextCoordinatesAndDirections(this._condition, this._direction).map(drawerFromCoordinate)
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

class LinkedLine extends Line {
  public get transitions(): string {
    return this._transitions
  }
  public isLeaf = true

  private _transitions: string

  public constructor(
    public readonly parent: LinkedLine | null,
    public readonly direction: number,
    public readonly condition: string,
    start: Vector,
    end: Vector,
  ) {
    super(start, end)
    this._transitions = `${parent?.transitions ?? ""}${direction}${condition}`
  }
}
