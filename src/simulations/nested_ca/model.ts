import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Rule, State } from "./rule"
import { Field } from "./field"

export class Model {
  public get t(): number {
    return this._t
  }
  public get field(): Field {
    return this._field
  }

  private _t = 0
  private _field: Field

  public constructor(
    public readonly size: Vector,
    public readonly rule: Rule,
  ) {
    this._field = Field.create(size, rule.numberOfStates)
    console.log(`rule: ${rule.toString()}, size: ${size}`)
  }

  public next(): void {
    // console.log(`next: ${this.field.states.length}`)
    const nextStates: State[][] = []
    for (let y = 0; y < this.field.states.length; y += 1) {
      const row: State[] = []
      const length = this.field.states[y].length
      for (let x = 0; x < length; x += 1) {
        const stateCounts = this.field.stateCounts(x, y, this.rule.radius, this.rule.weights)
        const nextState = this.rule.nextState(this.field.states[y][x], stateCounts)
        // console.log(`(${x}, ${y}) ${this.field.states[y][x]}, 0: ${stateCounts.stateCount(0)}, 1: ${stateCounts.stateCount(1)} -> ${nextState}`)
        row.push(nextState)
      }
      nextStates.push(row)
    }
    this._field = new Field(nextStates)

    this._t += 1
  }

  public draw(p: p5, cellSize: number): void {
    const cellHorizontalRadius = cellSize / 2
    const drawDiameter = cellSize * 0.9
    const rowHeight = cellSize * (Math.sqrt(3) / 2)
    const cellVerticalRadius = rowHeight / 2

    p.noStroke()

    for (let y = 0; y < this.field.states.length; y += 1) {
      const row = this.field.states[y]
      const isEvenRow = y % 2 === 0
      for (let x = 0; x < row.length; x += 1) {
        const state = row[x]
        const centerX = isEvenRow ? (x * cellSize) + cellHorizontalRadius : (x * cellSize)
        const centerY = (y * rowHeight) + cellVerticalRadius

        p.fill(this.rule.colorPalette.colorOf(state).p5(p))
        p.circle(centerX, centerY, drawDiameter)
      }
    }
  }
}
