import { AggregatedCellState, CellState } from "./cell_state"

export type GrowthFunction = {
  nextStateOf(currentState: CellState, neighbourSum: AggregatedCellState): CellState
}

export const exampleGrowthFunction: GrowthFunction = {
  nextStateOf(currentState: CellState, neighbourSum: AggregatedCellState): CellState {
    const sum = currentState + neighbourSum
    if (sum < 2) {
      return 0.0
    }
    if (sum < 3) {
      return currentState
    }
    if (sum < 4.0) {
      return 1.0
    }
    return 0.0
  }
}