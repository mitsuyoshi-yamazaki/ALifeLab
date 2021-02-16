import { Color } from "../../classes/color"

export type Bit = 0 | 1

export function canConnect(lhs: Bit, rhs: Bit): boolean {
  return lhs === (rhs ^ 1)
}

export class Tape {
  private _value: number
  private _color: Color

  public constructor(public readonly bits: Bit[]) {
    if (bits.length === 0) {
      throw new Error(`bits is empty`)
    }

    const binaryString = this.bits
      .map(x => `${x}`)
      .join("")
    this._value = parseInt(binaryString, 2)

    const third = Math.floor(this.bits.length / 3)
    const max = Math.pow(2, third) - 1
    const colorValueOf = (colorBits: Bit[]): number => {
      const colorBinaryString = colorBits.map(x => `${x}`)
        .join("")
      const colorValue = parseInt(colorBinaryString, 2)

      return Math.floor(0x7F * (colorValue / max)) + 0x80
    }
    const r = colorValueOf(this.bits.slice(0, third))
    const g = colorValueOf(this.bits.slice(third, third * 2))
    const b = colorValueOf(this.bits.slice(third * 2, this.bits.length))
    this._color = new Color(r, g, b)
  }

  public get color(): Color {
    return this._color
  }

  public get binary(): string {
    return this._value.toString(2).padStart(this.bits.length, "0")
  }

  public copy(): Tape {
    return new Tape(this.bits)
  }

  public split(): Tape[] {
    if (this.bits.length <= 1) {
      return [this.copy()]
    }

    const center = Math.floor(this.bits.length / 2)
    const head = this.bits.slice(0, center)
    const tail = this.bits.slice(center, this.bits.length)

    return [new Tape(head), new Tape(tail)]
  }
}
