import p5 from "p5"

export class Color {
  public constructor(public readonly r: number, public readonly g: number, public readonly b: number) {
  }

  public p5(p: p5, alpha: number): p5.Color {
    return p.color(this.r, this.g, this.b, alpha)
  }
}
