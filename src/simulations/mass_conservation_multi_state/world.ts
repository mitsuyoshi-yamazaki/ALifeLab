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

const numberOfNeighbourCells = 4
const minimumOutgoingMass = numberOfNeighbourCells

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
  readonly top: number  // 上セルから流入する量
  readonly left: number // 左セルから流入する量
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
          if (state.substances["blue"] < 0 || state.substances["red"] < 0) {
            console.log("below zero") // FixMe: 消す
          }

          const topY = (y - 1 + this.size.y) % this.size.y
          const topX = ((): number => {
            if (y !== 0) {
              return x
            }
            // return this.size.x - x - 1
            return x
          })()
          const topState = this.cells[topY][topX]
          if (topState == null) {
            console.log(`${x},${y}, ${topX},${topY}, ${this.size}`)
          }

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
    return this.transitionInTwoSubstances(state, neighbourState, "blue", "red")
  }

  private redTransitionAmount(state: CellState, neighbourState: CellState): number {
    return this.transitionInTwoSubstances(state, neighbourState, "red", "blue")
  }

  private transitionInTwoSubstances(state: CellState, neighbourState: CellState, substance: CellSubstanceType, other: CellSubstanceType): number {
    const massTransferResistance = 128

    // 正の数ならt+1でstateの質量が増加⏫
    const sameSubstancePressure = neighbourState.substances[substance] - state.substances[substance]

    // 正の数ならt+1でstateの質量が減少⏬
    const otherSubstancePressure = state.substances[other] - state.substances[substance]

    // 正の数ならt+1でstateの質量が増加⏫
    const neighbourOtherSubstancePressure = neighbourState.substances[other] - neighbourState.substances[substance]

    // 正の数ならt+1でstateの質量が減少⏬
    const otherSubstanceTotalPressure = otherSubstancePressure - neighbourOtherSubstancePressure

    // 正の数ならt+1でstateの質量が増加⏫
    const totalPressure = sameSubstancePressure - otherSubstanceTotalPressure
    const transitionAmount = totalPressure / massTransferResistance
    
    if (transitionAmount > 0) {
      const maximumIncommingTransitionAmount = neighbourState.substances[substance] / numberOfNeighbourCells
      return Math.floor(Math.min(transitionAmount, maximumIncommingTransitionAmount))
    } else {
      const minimumOutgoingTransitionAmount = state.substances[substance] / numberOfNeighbourCells
      return Math.ceil(Math.max(transitionAmount, -minimumOutgoingTransitionAmount))
    }
  }
}