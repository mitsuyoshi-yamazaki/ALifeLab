import { AggregatedCellState, CellState } from "./cell_state"

export type GrowthFunction = {
  nextStateOf(sum: AggregatedCellState): CellState
}

export const growingGrowthFunction: GrowthFunction = {
  nextStateOf(sum: AggregatedCellState): CellState {
    if (sum > 0) {
      return 1
    }
    return 0
  }
}

export const exampleGrowthFunction: GrowthFunction = {
  nextStateOf(sum: AggregatedCellState): CellState {
    if (sum < 2) {
      return 0
    }
    if (sum < 4) {
      return 1
    }
    return 0
  }
}

type RangeGrowthFunctionRange = {
  readonly value: number
  readonly state: CellState
}

const ordinalNumber = (value: number): string => {
  switch (value) {
  case 1:
    return "1st"
  case 2:
    return "2nd"
  case 3:
    return "3rd"
  default:
    return `${value}th`
  }
}

export class RangeGrowthFunction implements GrowthFunction {
  public constructor(
    public readonly ranges: RangeGrowthFunctionRange[],
  ) {
  }

  /** @throws */
  public static parseRanges(rawValue: string): RangeGrowthFunctionRange[] {
    const rawRanges = rawValue.split(";")
    return rawRanges.map((rawRange, i) => {
      const components = rawRange.split(",")
      if (components.length !== 2) {
        throw `${ordinalNumber(i)} range ${rawRange} can not split into 2 floating numbers by ','`
      }
      const value = parseFloat(components[0])
      if (isNaN(value) === true) {
        throw `${ordinalNumber(i)} range ${rawRange} has invalid value ${components[0]}`
      }

      const state = parseFloat(components[1])
      if (isNaN(state) === true) {
        throw `${ordinalNumber(i)} range ${rawRange} has invalid state ${components[1]}`
      }

      return {
        value,
        state,
      }
    })
  }

  public nextStateOf(sum: AggregatedCellState): CellState {
    for (let i = 0; i < this.ranges.length; i += 1) {
      const range = this.ranges[i]
      if (sum < range.value) {
        return range.state
      }
    }
    return 0
  }
}

export class ContinuousGrowthFunction implements GrowthFunction {
  public constructor(
  ) {
  }

  public nextStateOf(sum: AggregatedCellState): CellState {
    throw "not implemented"
  }
}