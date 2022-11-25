import { Vector } from "../../classes/physics"
import { Drawable } from "./drawable"

export const cellSubstanceTypes = [
  "blue",
  "red",
  // "green",
] as const
export type CellSubstanceType = (typeof cellSubstanceTypes[number])

export type CellSubstance = {
  readonly substanceType: CellSubstanceType
  readonly mass: number
}
export type CellState = {
  readonly substances: {[Substance in CellSubstanceType]: number}
}

// type TransitionRuleCohesive = {
//   readonly case: "cohesive"
// }
// type TransitionRuleSeparation = {
//   readonly case: "separation"
// }
// type TransitionRuleUniform = {
//   readonly case: "uniform"
// }
// type TransitionRule = void  // TODO:

type MassTransfer = {
  readonly top: number
  readonly left: number
}

export type WorldDrawableState = {
  readonly case: "world"
  readonly cellStates: CellState[][]
}

export class World implements Drawable<WorldDrawableState> {
  public cells: CellState[][]

  public constructor(
    public readonly size: Vector,
    // private readonly rules: TransitionRule[],  // TODO: 一般化する
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
    const massTransfer: { [Substance in CellSubstanceType]: MassTransfer[][] } = {
      blue: [],
      red: [],
    }
    const getAllTransfer = (x: number, y: number, substance: CellSubstanceType): number => {
      let result = 0
      const transfer = massTransfer[substance][y][x]
      result += transfer.top
      result += transfer.left

      const bottomY = (y + 1) % this.size.y
      const bottomTransfer = massTransfer[substance][bottomY][x]
      result -= bottomTransfer.top

      const rightX = (x + 1) % this.size.x
      const rightTransfer = massTransfer[substance][y][rightX]
      result -= rightTransfer.left

      return result
    }

    cellSubstanceTypes.forEach(substance => {
      this.cells.forEach((row, y) => {
        const transferRow: MassTransfer[] = []
        massTransfer[substance].push(transferRow)

        row.forEach((state, x) => {
          const topY = (y - 1 + this.size.y) % this.size.y
          const topState = this.cells[topY][x]

          const leftX = (x - 1 + this.size.x) % this.size.x
          const leftState = this.cells[y][leftX]

          transferRow.push(this.transition(substance, state, topState, leftState))
        })
      })
    })

    const nextStates: CellState[][] = []

    this.cells.forEach((row, y) => {
      const nextRow: CellState[] = []
      nextStates.push(nextRow)

      row.forEach((state, x) => {
        nextRow.push({
          substances: {
            blue: state.substances["blue"] + getAllTransfer(x, y, "blue"),
            red: state.substances["red"] + getAllTransfer(x, y, "red"),
          },
        })
      })
    })
    this.cells = nextStates
  }

  private transition(substance: CellSubstanceType, state: CellState, topState: CellState, leftState: CellState): MassTransfer {
    switch (substance) {
    case "blue":
      return {
        top: this.blueTransitionAmount(state, topState),
        left: this.blueTransitionAmount(state, leftState)
      }
    case "red":
      return {
        top: this.redTransitionAmount(state, topState),
        left: this.redTransitionAmount(state, leftState)
      }
    }
  }

  private blueTransitionAmount(state: CellState, neighbourState: CellState): number {
    const substance = "blue"
    const massTransferResistance = 128
    const diff = Math.floor((neighbourState.substances[substance] - state.substances[substance]) / massTransferResistance)

    return diff
  }

  private redTransitionAmount(state: CellState, neighbourState: CellState): number {
    return 0  // TODO:
  }
}