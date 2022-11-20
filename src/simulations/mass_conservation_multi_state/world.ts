import { Vector } from "../../classes/physics"
import { Drawable } from "./drawable"

export const cellSubstances = [
  "hydrogen",
  "nitrogen",
] as const
export type CellSubstance = (typeof cellSubstances[number]) | "vacuum"

export type CellState = {
  readonly substance: CellSubstance
  readonly mass: number
}

type MassTransfer = {
  readonly top: number
  readonly left: number
}

const massTransferResistance = 128

export type WorldDrawableState = {
  readonly case: "world"
  readonly cellStates: CellState[][]
}

export class World implements Drawable<WorldDrawableState> {
  public cells: CellState[][]

  public constructor(
    public readonly size: Vector,
    initialStates: CellState[][],
  ) {
    this.cells = initialStates
  }

  public drawableState(): WorldDrawableState {
    return {
      case: "world",
      cellStates: this.cells,
    }
  }

  public calculate(): void {
    const massTransfer: MassTransfer[][] = []
    const getAllTransfer = (x: number, y: number): number => {
      let result = 0
      const transfer = massTransfer[y][x]
      result += transfer.top
      result += transfer.left

      const bottomY = (y + 1) % this.size.y
      const bottomTransfer = massTransfer[bottomY][x]
      result -= bottomTransfer.top

      const rightX = (x + 1) % this.size.x
      const rightTransfer = massTransfer[y][rightX]
      result -= rightTransfer.left

      return result
    }

    this.cells.forEach((row, y) => {
      const transferRow: MassTransfer[] = []
      massTransfer.push(transferRow)

      row.forEach((state, x) => {
        const topY = (y - 1 + this.size.y) % this.size.y
        const topState = this.cells[topY][x]
        const top = Math.floor((topState.mass - state.mass) / massTransferResistance)

        const leftX = (x- 1 + this.size.x) % this.size.x
        const leftState = this.cells[y][leftX]
        const left = Math.floor((leftState.mass - state.mass) / massTransferResistance)

        transferRow.push({
          top,
          left,
        })
      })
    })

    const nextStates: CellState[][] = []
    this.cells.forEach((row, y) => {
      const nextRow: CellState[] = []
      nextStates.push(nextRow)

      row.forEach((state, x) => {
        const mass = state.mass + getAllTransfer(x, y)
        nextRow.push({
          substance: state.substance,
          mass,
        })
      })
    })
    this.cells = nextStates
  }
}