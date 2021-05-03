
export type Bit = 0 | 1

/*
 * ルール
 * a:2,3;s:3
 * a: alive
 * s: stay 
 * radius = 1
 * state = [0, 1]
 */
export class BinaryRule {
  public get radius(): number {
    return this._radius
  }
  public get alive(): number[] {
    return this._alive
  }
  public get stay(): number[] {
    return this._stay
  }

  private _radius = 1
  private _alive: number[]
  private _stay: number[]

  public constructor(rule: string) {
    const neighbours = this._radius * 6
    const parseIntArray = (s: string): number[] => {
      if (s.length === 0) {
        return []
      }
      return s.split(",").map(str => {
        const num = parseInt(str, 10)
        if (isNaN(num)) {
          throw new Error(`Invalid rule: "${str}" is not a number (${rule})`)
        }
        if (num < 0 || num > neighbours) {
          throw new Error(`Invalid rule: invalid neighbour count: ${num} (${rule})`)
        }
        return num
      })
    }
    const parseComponents = (): Map<string, number[]> => {
      const result = new Map<string, number[]>()
      const components = rule.split(";")
      if (components.length !== 2) {
        throw new Error(`Invalid rule: ${rule}`)
      }
      components.forEach(component => {
        const pair = component.split(":")
        if (pair.length !== 2) {
          throw new Error(`Invalid rule: invalid format ${component} (${rule})`)
        }
        result.set(pair[0], parseIntArray(pair[1]))
      })
      return result
    }
    const components = parseComponents()
    const alive = components.get("a")
    if (alive == null) {
      throw new Error(`Invalid rule: missing alive component (${rule})`)
    }
    this._alive = alive
    const stay = components.get("s")
    if (stay == null) {
      throw new Error(`Invalid rule: missing stay component (${rule})`)
    }
    this._stay = stay
  }

  // TODO:
  // public static random(): Rule {

  // }

  public next(map: Bit[][]): Bit[][] {
    const result: Bit[][] = []
    for (let y = 0; y < map.length; y += 1) {
      const row = map[y]
      const resultRow: Bit[] = []
      for (let x = 0; x < row.length; x += 1) {
        resultRow.push(this.nextBit(row[x], this.neighbourSum(map, x, y)))
      }
      result.push(resultRow)
    }
    return result
  }

  public nextBit(current: Bit, neighbours: number): Bit {
    if (current === 0 && this.alive.includes(neighbours)) {
      return 1
    }
    if (current === 1 && this.stay.includes(neighbours)) {
      return 1
    }
    return 0
  }

  public neighbourSum(map: Bit[][], x: number, y: number): number {
    const radius = this.radius
    let result = 0
    const isEvenRow = y % 2 === 0
    for (let j = -radius; j <= radius; j += 1) {
      const neighbourRow = map[(y + j + map.length) % map.length]
      for (let i = -radius; i <= radius; i += 1) {
        if (i === 0 && j === 0) {
          continue
        }
        if (j !== 0) {
          if (isEvenRow && i < 0) {
            continue
          }
          if (!isEvenRow && i > 0) {
            continue
          }
        }
        const cell = neighbourRow[(x + i + neighbourRow.length) % neighbourRow.length]
        result += cell
      }
    }
    return result
  }
}