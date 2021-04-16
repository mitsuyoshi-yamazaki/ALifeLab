import p5 from "p5"

export class Color {
  public constructor(public readonly r: number, public readonly g: number, public readonly b: number, public readonly alpha: number) {
  }

  public static white(white?: number, alpha?: number): Color {
    return new Color(white ?? 0xFF, white ?? 0xFF, white ?? 0xFF, alpha ?? 0xFF)
  }

  public p5(p: p5, alpha?: number): p5.Color {
    return p.color(this.r, this.g, this.b, alpha ?? this.alpha)
  }

  public toString(): string {
    const rawColorToString = (value: number): string => {
      return value.toString(16)
        .padStart(2, "0")
    }

    return `#${rawColorToString(this.r)}${rawColorToString(this.g)}${rawColorToString(this.b)}`
  }
}
