import { Vector } from "../../classes/physics"
import { Color } from "../../classes/color"
import { Action } from "./drawer"
import { Line } from "./line"
import { LSystemCoordinate } from "./lsystem_rule"
import { Model } from "./model"
import { LSystemDrawer } from "./lsystem_drawer"
import { VanillaLSystemRule } from "./vanilla_lsystem_rule"

// "<direction><condition>" ("-152A")
// "(<conditions>)^<n>" ("(-152A,32B)^3", "((2A)^2,-54A)^3")
type Transition = string

type TransitionInstance = Transition | TransitionStruct

// interface TransitionStruct {
//   readonly value: TransitionStruct[]
//   readonly count: number
// }

// class SingleTransitionStruct implements TransitionStruct {
//   public readonly value: TransitionStruct[]
//   public readonly count = 1

//   public constructor(transition: Transition) {
//     this.value = 
//   }
// }

// class MultipleTransitionStruct implements TransitionStruct {

// }

export class TransitionStruct {
  public readonly transitions: TransitionInstance[]
  public readonly count: number

  public constructor(transition: Transition);
  public constructor(transitions: TransitionInstance[], count: number);
  public constructor(first: string | TransitionInstance[], second?: number) {
    if (typeof (first) === "string") {
      this.transitions = [first]
      this.count = 1
    } else if (second != null) {
      this.transitions = first
      this.count = second
    } else {
      throw new Error("Invalid arguments")
    }
  }

  public withCount(count: number): TransitionStruct {
    return new TransitionStruct(this.transitions, count)
  }

  public toString(): string {
    if (this.count <= 1) {
      return this.transitions.map(t => t.toString()).join(",")
    }
    if (this.transitions.length <= 1) {
      return `${this.transitions.map(t => t.toString()).join(",")}^${this.count}`
    }
    return `(${this.transitions.map(t => t.toString()).join(",")})^${this.count}`
  }
}

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
    console.log(`calculateTransition() ${this.lSystemRules[0].encoded}`)
    const leaves: LinkedLine[] = this._lines.filter(line => {
      if (line instanceof LinkedLine) {
        return line.isLeaf
      }
      return false
    }) as LinkedLine[]

    const transitions: Transition[][] = []
    leaves.forEach(line => {
      if (transitions.includes(line.transitions)) {
        return
      }
      transitions.push(line.transitions)
    })
    const sort = (l: Transition[], r: Transition[]): number => {
      if (l.length === r.length) {
        return 0
      }
      return l.length < r.length ? 1 : -1
    }
    // transitions.sort(sort).slice(0, 100).forEach(t => console.log(analyzeTransition(t)))

    console.log(`${transitions.length} transitions (${leaves.length} leaves)`)
  }
}

export function analyzeTransition(transitions: Transition[]): TransitionStruct {
  return analyzeTransitionRecursively(transitions, 1)
}

function analyzeTransitionRecursively(transitions: TransitionInstance[], searchLength: number): TransitionStruct {
  if (transitions.length === 0) {
    throw new Error("Invalid arguments")
  } else if (transitions.length <= 1) {
    if (transitions[0] instanceof TransitionStruct) {
      return transitions[0]
    } else {
      return new TransitionStruct(transitions[0])
    }
  } else if (transitions.length / 2 < searchLength) {
    return concatTransitions(transitions)
  }

  let changed = false
  const result: TransitionInstance[] = []
  for (let i = 0; i < transitions.length; i += 1) {
    if (i + searchLength > transitions.length) {
      result.push(new TransitionStruct(transitions.slice(i), 1))
      // console.log(`${concatTransitions(transitions.slice(i))}, ${i}, ${0}, ${searchLength}, ${transitions.join(";")},, ${result.join(";")}`)  // FixMe: 消す
      break
    }

    const searchSlice = transitions.slice(i, i + searchLength)
    const searchTransition = concatTransitions(searchSlice)
    let count = 1
    for (let j = i + searchLength; j <= (transitions.length - searchLength); j += searchLength) {
      const compare = concatTransitions(transitions.slice(j, j + searchLength))
      if (searchTransition.toString() === compare.toString()) {
        count += 1
        i = j + searchLength - 1
      } else {
        break
      }
    }
    if (count > 1) {
      result.push(searchTransition.withCount(count))
      changed = true
    } else {
      result.push(transitions[i])
    }
    // console.log(`${searchTransition}, ${i}, ${count}, ${searchLength}, ${transitions.join(";")},, ${result.join(";")}`)  // FixMe: 消す
  }

  if (changed) {
    return analyzeTransitionRecursively(result, 1)
  } else {
    return analyzeTransitionRecursively(transitions, searchLength + 1)
  }
}

export function concatTransitions(transitions: TransitionInstance[]): TransitionStruct {
  if (transitions.length === 1) {
    if (transitions[0] instanceof TransitionStruct) {
      return transitions[0]
    } else {
      return new TransitionStruct(transitions[0])
    }
  }
  return new TransitionStruct(transitions, 1)
}

export function aggregatePatterns(transitions: Transition[][], leastCount: number): TransitionStruct[] {
  const patterns: TransitionStruct[] = []
  const stringPatterns: string[] = []
  transitions.forEach(t => {
    extractPatterns(t, leastCount).forEach(pattern => {
      const patternString = pattern.toString()
      if (stringPatterns.includes(patternString)) {
        return
      }
      patterns.push(pattern)
      stringPatterns.push(patternString)
    })
  })
  return patterns
}

export function extractPatterns(transitions: Transition[], leastCount: number): TransitionStruct[] {
  const result: TransitionStruct[] = []
  transitions.forEach(transition => {
    const components = transition.split(",")
  })

  return [] // TODO:
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
    const transition = `${this.relativeDirection}${this._condition}`
    const line = new LinkedLine(this.parentLine, transition, this._position, nextPosition)
    line.color = this.lineColor() ?? Color.white(0x0)

    const sliceIndex = Math.max((this.conditionHistory.length + 1) - this.rule.transition.maxLoopLength * this._loopCount, 0)
    const nextHistory = `${this.conditionHistory}${this._condition}`.slice(sliceIndex)

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
  public get transitions(): Transition[] {
    return this._transitions
  }
  public isLeaf = true

  private _transitions: Transition[]

  public constructor(
    public readonly parent: LinkedLine | null,
    public readonly transition: Transition,
    start: Vector,
    end: Vector,
  ) {
    super(start, end)
    this._transitions = (parent?.transitions ?? []).concat([transition])
  }
}
