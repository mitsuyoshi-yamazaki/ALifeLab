import { AggregatedCellState, CellState } from "./cell_state"

export type GrowthFunction = {
  nextStateOf(sum: AggregatedCellState): CellState
}

export const growingGrowthFunction: GrowthFunction = {
  nextStateOf(sum: AggregatedCellState): CellState {
    if (sum > 0) {
      return 1
    }
    return -1
  }
}

export const exampleGrowthFunction: GrowthFunction = {
  nextStateOf(sum: AggregatedCellState): CellState {
    if (sum < 2) {
      return -1
    }
    if (sum < 3) {
      return 0
    }
    if (sum < 4.0) {
      return 1
    }
    return -1
  }
}