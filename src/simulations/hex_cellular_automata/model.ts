import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { InitialState } from "./initial_state"
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
    initialState: InitialState,
  ) {
    this._state = createState(size, initialState)
  }

  public next(): void {
    this._state = this.rule.next(this.state)
    this._t += 1
  }

  public draw(p: p5, fieldSize: Vector, cellSize: number): void {
    const cellRadius = cellSize / 2
    const drawDiameter = cellSize * 0.9
      
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
        const centerX = isEvenRow ? (x * cellSize) + cellRadius : (x * cellSize)
        const centerY = (y * cellSize) + cellRadius
        
        p.circle(centerX, centerY, drawDiameter)
      }
    }
  }
}

function createState(size: Vector, type: InitialState): State {
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
      }
    }
    state.push(row)
  }
  return state
}