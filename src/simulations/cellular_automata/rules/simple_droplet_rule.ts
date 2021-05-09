import { Color } from "../../../classes/color"
import { State, StateMap, Rule } from "../rule"
import { ColorPalette } from "../color_palette"

const empty = 0
const head = 1
const body = 2
const tail = 3

class SimpleDropletColorPalette implements ColorPalette {
  public get numberOfColors(): number {
    return this._colors.length
  }

  private _colors: Color[] = [
    Color.white(0x0),             // empty
    Color.white(0xFF, 0xD8),      // head
    new Color(0xFC, 0x88, 0x45),  // tail
    new Color(83, 150, 205),      // body
  ]

  public toString(): string {
    return "SimpleDropletColorPalette"
  }

  public colorOf(state: State): Color {
    return this._colors[state]
  }
}

export class SimpleDropletRule implements Rule {
  public get numberOfStates(): number {
    return this.colorPalette.numberOfColors
  }
  public get weights(): number[] {
    return this._weights
  }
  public get colorPalette(): SimpleDropletColorPalette {
    return this._colorPalette
  }

  private _weights: number[] = []
  private _colorPalette: SimpleDropletColorPalette

  public constructor(public readonly radius: number) {
    this._colorPalette = new SimpleDropletColorPalette()
    if (radius <= 0) {
      throw new Error(`Invalid argument: radius should be > 0 (${radius})`)
    }
    for (let i = 0; i <= radius; i += 1) {
      this._weights.push(1)
    }
  }

  public toString(): string {
    return `SimpleDropletRule with ${this.colorPalette.toString()}`
  }

  public nextState(state: State, states: StateMap): State {
    // FixMe: weights計算は面倒なので無視している
    states.increment(state, 1)

    const unit = 6
    const maxUnit = this.radius * (this.radius + 1) / 2
    const emptyCount = states.stateCount(empty)
    const headCount = states.stateCount(head)
    const bodyCount = states.stateCount(body)
    const tailCount = states.stateCount(tail)
    
    if (bodyCount > unit * maxUnit) {
      return tail
    }
    if (headCount > unit * maxUnit) {
      return body
    }
    if (headCount > unit * maxUnit * 0.4 && tailCount <= 0) {
      return head
    }
    return empty
  }
}

/* MEMO
// Glider
?s.ei=1&s.ar=droplet&s.cs=5&s.r=1&s.is=random
  public nextState(state: State, states: StateMap): State {
    // FixMe: weights計算は面倒なので無視している
    states.increment(state, 1)

    const emptyCount = states.stateCount(empty)
    const headCount = states.stateCount(head)
    const tailCount = states.stateCount(tail)

    if (headCount > 0 && headCount <= (this.radius * 2 + 1) && tailCount <= 0 && emptyCount > 0) {
      return head
    }
    if (headCount > 0 && headCount <= (this.radius * 2 + 1) && tailCount > 0 && tailCount <= (this.radius * 2 + 1) && emptyCount > 0) {
      return tail
    }
    return empty
  }

  // Glider2
    public nextState(state: State, states: StateMap): State {
    // FixMe: weights計算は面倒なので無視している
    states.increment(state, 1)

    const emptyCount = states.stateCount(empty)
    const headCount = states.stateCount(head)
    const bodyCount = states.stateCount(body)
    const tailCount = states.stateCount(tail)

    if (headCount > 0 && headCount <= (this.radius * 2 + 1) && tailCount <= 0 && bodyCount > 0) {
      return head
    }
    if (tailCount > 0 && tailCount <= (this.radius * 2 + 1) && headCount <= 0 && bodyCount > 0) {
      return tail
    }
    if (headCount > 0 && tailCount > 0) {
      return body
    }
    return empty
  }
*/