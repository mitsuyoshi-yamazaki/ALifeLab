import { Color } from "../../classes/color"
import { State } from "./rule"

export interface ColorPalette {
  colorOf(state: State): Color
}

export class BinaryColorPalette implements ColorPalette {
  private _colors: Color[] = [
    Color.white(0x0),
    Color.white(0xFF, 0xD8),
  ]

  public colorOf(state: State): Color {
    return this._colors[state]
  }
}
