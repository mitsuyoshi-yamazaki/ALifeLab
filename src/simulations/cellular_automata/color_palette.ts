import { Color } from "../../classes/color"
import { State } from "./state"

export interface ColorPalette {
  toString(): string
  colorOf(state: State): Color
}

export class BinaryColorPalette implements ColorPalette {
  private _colors: Color[] = [
    Color.white(0x0),
    Color.white(0xFF, 0xD8),
  ]

  public toString(): string {
    return "BinaryColorPalette"
  }

  public colorOf(state: State): Color {
    return this._colors[state]
  }
}
