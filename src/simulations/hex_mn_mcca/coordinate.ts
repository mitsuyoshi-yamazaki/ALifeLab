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

// /**
//  * Cube Coordinateでアクセスできる、外形が六角形の配列
//  */
// export class HexArray<T> {
//   private content: (T | undefined)[][] = []

//   public constructor(
//     public readonly size: number,
//   ) {
//     this.initialize()
//   }

//   private initialize(): void {
//     this.content = (new Array(this.size)).map((_, i): undefined[] => {
//       if (i <= 0) {
//         return [undefined]
//       }
//       return (new Array(i * 6)).fill(undefined)
//     })
//   }

//   public clear(): void {
//     this.initialize()
//   }

//   public get(index: HexVector): T | undefined {
    
//   }
// }