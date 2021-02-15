import { Color } from "../../classes/color"

export type Bit = 0 | 1

export function canConnect(lhs: Bit, rhs: Bit): boolean {
  return lhs === (rhs ^ 1)
}

export class Tape {
  private _value: number
  private _bits: Bit[]
  private _color: Color

  public constructor(value: number | Bit[]) { // FixMe: number だとlengthが制限されてしまう
    if (typeof value === "number") {
      this._value = Math.floor(value)
      this._bits = this.value
        .toString(2)
        .split("")
        .map(x => x === "1" ? 1 : 0)
    } else {
      this._bits = value
      const binaryString = this.bits
        .map(x => `${x}`)
        .join("")
      this._value = parseInt(binaryString, 2)
    }

    const third = Math.floor(this.bits.length / 3)
    const max = Math.pow(2, this.bits.length) - 1
    const colorValueOf = (bits: Bit[]): number => {
      const binaryString = bits.map(x => `${x}`)
        .join("")
      const colorValue = parseInt(binaryString, 2)

      return (Math.floor(0xF * (colorValue / max)) << 3) + 0x80
    }
    const r = colorValueOf(this.bits.slice(0, third)) // TODO: 確認
    const g = colorValueOf(this.bits.slice(third, third * 2))
    const b = colorValueOf(this.bits.slice(third * 2, this.bits.length))
    this._color = new Color(r, g, b)
  }

  public static hex(value: number): string {
    return `${value.toString(16)}`
  }

  public get value(): number {
    return this._value
  }

  public get bits(): Bit[] {
    return this._bits
  }

  public get color(): Color {
    return this._color
  }

  public get hex(): string {
    return Tape.hex(this.value)
  }

  public copy(): Tape {
    return new Tape(this.value)
  }

  public split(): [Tape, Tape | undefined] {
    if (this.bits.length <= 1) {
      return [this.copy(), undefined]
    }

    const center = Math.floor(this.bits.length / 2)
    const head = this.bits.slice(0, center)
    const tail = this.bits.slice(center, this.bits.length)

    return [new Tape(head), new Tape(tail)]
  }

  public concat(bits: Bit[]): Tape {
    return new Tape(this.bits.concat(bits))
  }
}
