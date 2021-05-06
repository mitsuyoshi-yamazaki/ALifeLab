import { Color } from "../../../classes/color"
import { State, StateMap, Rule } from "../rule"
import { ColorPalette } from "../color_palette"

const empty = 0
const liquid = 1
const membrane = 2

class SimpleMembraneColorPalette implements ColorPalette {
  private _colors: Color[] = [
    Color.white(0x0),             // empty
    Color.white(0xFF, 0xD8),      // liquid
    new Color(0xFC, 0x88, 0x45),  // membrane
  ]

  public toString(): string {
    return "SimpleMembraneColorPalette"
  }

  public colorOf(state: State): Color {
    return this._colors[state]
  }
}

export class SimpleMembraneRule implements Rule {
  public numberOfStates = 2
  public get weights(): number[] {
    return this._weights
  }
  public get colorPalette(): ColorPalette {
    return this._colorPalette
  }

  private _weights: number[] = []
  private _colorPalette: ColorPalette

  public constructor(public readonly radius: number) {
    this._colorPalette = new SimpleMembraneColorPalette()
    if (radius <= 0) {
      throw new Error(`Invalid argument: radius should be > 0 (${radius})`)
    }
    for (let i = 0; i <= radius; i += 1) {
      this._weights.push(1)
    }
  }

  public toString(): string {
    return `SimpleMembraneRule with ${this.colorPalette.toString()}`
  }

  public nextState(state: State, states: StateMap): State {
    // FixMe: weights計算は面倒なので無視している
    states.increment(state, 1)
    const emptyCount = states.stateCount(empty)
    const liquidCount = states.stateCount(liquid) + states.stateCount(membrane)
    const diff = liquidCount - emptyCount
    if (diff >= 0 && diff <= this.radius * 3 + 1) {
      return membrane
    }
    return emptyCount > liquidCount ? empty : liquid
  }
}
