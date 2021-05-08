import { Color } from "../../../classes/color"
import { State, StateMap, Rule } from "../rule"
import { ColorPalette } from "../color_palette"

const empty = 0
const head = 1
const tail = 2

class SimpleDropletColorPalette implements ColorPalette {
  private _colors: Color[] = [
    Color.white(0x0),             // empty
    Color.white(0xFF, 0xD8),      // head
    new Color(0xFC, 0x88, 0x45),  // tail
  ]

  public toString(): string {
    return "SimpleDropletColorPalette"
  }

  public colorOf(state: State): Color {
    return this._colors[state]
  }
}

export class SimpleDropletRule implements Rule {
  public numberOfStates = 3
  public get weights(): number[] {
    return this._weights
  }
  public get colorPalette(): ColorPalette {
    return this._colorPalette
  }

  private _weights: number[] = []
  private _colorPalette: ColorPalette

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
}
