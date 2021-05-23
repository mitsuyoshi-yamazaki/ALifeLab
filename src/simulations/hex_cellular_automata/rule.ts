import { random } from "../../classes/utilities"
import { Color } from "../../classes/color"

export interface Bit {
  value: 0 | 1
  color: Color | null
}
export type State = Bit[][]

interface Neighbours {
  count: number
  color: Color | null
}

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

  public constructor(public readonly rule: string) {
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

  public static random(): BinaryRule {
    const candidates: number[] = [0, 1, 2, 3, 4, 5, 6]
    const alive: number[] = candidates.filter(() => random(1) < 0.5)
    const stay: number[] = candidates.filter(() => random(1) < 0.5)
    const rule = `a:${alive.join(",")};s:${stay.join(",")}`

    return new BinaryRule(rule)
  }

  public next(map: State): State {
    const result: State = []
    for (let y = 0; y < map.length; y += 1) {
      const row = map[y]
      const resultRow: Bit[] = []
      for (let x = 0; x < row.length; x += 1) {
        const neighbours = this.neighbourSum(map, x, y)
        resultRow.push(this.nextBit(row[x], neighbours.count, neighbours.color))
      }
      result.push(resultRow)
    }
    return result
  }

  public nextBit(current: Bit, neighbours: number, color: Color | null): Bit {
    if (current.value === 0 && this.alive.includes(neighbours)) {
      return { value: 1, color: color ?? Color.white() }
    }
    if (current.value === 1 && this.stay.includes(neighbours)) {
      return current
    }
    return { value: 0, color: null }
  }

  // FixMe: この辺間違ってる: cellular_automaton を参照
  public neighbourSum(map: State, x: number, y: number): Neighbours {
    const radius = this.radius
    let result = 0
    const isEvenRow = y % 2 === 0
    let color: Color | null = null
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
        if (color == null && cell.value === 1) {
          color = cell.color
        }
        result += cell.value
      }
    }
    return { count: result, color: color }
  }
}