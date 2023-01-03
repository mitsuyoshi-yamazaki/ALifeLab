/**
 * Cube Coordinate
 * https://www.redblobgames.com/grids/hexagons/
 */
export class HexVector {
  public s: number

  public constructor(
    public readonly q: number,
    public readonly r: number,
  ) {
    this.s = 0 - q - r
  }

  public toString(): string {
    return `(${this.q},${this.r},${this.s})`
  }

  public add(other: HexVector): HexVector {
    return new HexVector(this.q + other.q, this.r + other.r)
  }
}
