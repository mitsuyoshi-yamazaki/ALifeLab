import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { InitialStateType } from "./initial_state_type"
import { BinaryRule, State, Bit } from "./rule"

export class Model {
  public get t(): number {
    return this._t
  }
  public get state(): State {
    return this._state
  }

  private _t = 0
  private _state: State

  public constructor(
    public readonly size: Vector,
    public readonly rule: BinaryRule,
    initialState: InitialStateType,
  ) {
    this._state = createState(size, initialState)
    console.log(`rule: ${rule.rule}, size: ${size}`)
  }

  public next(): void {
    this._state = this.rule.next(this.state)
    this._t += 1
  }

  public draw(p: p5, cellSize: number): void {
    const cellHorizontalRadius = cellSize / 2
    const drawDiameter = cellSize * 0.9
    const rowHeight = cellSize * (Math.sqrt(3) / 2)
    const cellVerticalRadius = rowHeight / 2
      
    p.noStroke()
    p.fill(0xFF, 0xD0)

    for (let y = 0; y < this.state.length; y += 1) {
      const row = this.state[y]
      const isEvenRow = y % 2 === 0
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x]
        if (cell !== 1) {
          continue
        }
        const centerX = isEvenRow ? (x * cellSize) + cellHorizontalRadius : (x * cellSize)
        const centerY = (y * rowHeight) + cellVerticalRadius
        
        p.circle(centerX, centerY, drawDiameter)
      }
    }
  }
}

function createState(size: Vector, type: InitialStateType): State {
  const localityAlivePoints: Vector[] = [size.randomized(), size.randomized(), size.randomized(), size.randomized()]
  const localityAliveDistance = Math.min(size.x, size.y) * 0.2
  const centerX = Math.floor(size.x / 2)
  const centerY = Math.floor(size.y / 2)
  const state: State = []
  for (let y = 0; y < size.y; y += 1) {
    const row: Bit[] = []
    for (let x = 0; x < size.x; x += 1) {
      switch (type) {
      case "random":
        if (random(1) < 0.5) {
          row.push(1)
        } else {
          row.push(0)
        }
        break
        
      case "one":
        if (x === centerX && y === centerY) {
          row.push(1)
        } else {
          row.push(0)
        }
        break
        
      case "line":
        if (y === centerY) {
          row.push(1)
        } else {
          row.push(0)
        }
        break
        
      case "gradation": {
        const simpleGradationValue = Math.abs(y - centerY) / centerY
        const gradationValue = Math.max(Math.min(simpleGradationValue * 1.2 - 0.1, 1), 0)
        if (random(1) < gradationValue) {
          row.push(1)
        } else {
          row.push(0)
        }
        break
      }

      case "locality": {
        const currentPoint = new Vector(x, y)
        const nearestAlivePoint = localityAlivePoints.sort((lhs: Vector, rhs: Vector): number => {
          const distanceL = currentPoint.dist(lhs)
          const distanceR = currentPoint.dist(rhs)
          if (distanceL === distanceR) {
            return 0
          }
          return distanceL > distanceR ? 1 : -1
        })[0]

        const distance = currentPoint.dist(nearestAlivePoint)
        if (distance > localityAliveDistance) {
          row.push(0)
          break
        }
        if (random(1) > (distance / localityAliveDistance)) {
          row.push(1)
        } else {
          row.push(0)
        }
        break
      }

      default:
        console.error(`Not implemented: initial state type ${type}`)
        break
      }
    }
    state.push(row)
  }
  return state
}
