import { Hull } from "../module/module"
import { MaterialType, Energy } from "../physics/material"

type MaterialStore = { [Material in (MaterialType | Energy)]: number }

export type Scope = {
  readonly amount: MaterialStore
  capacity: number
  heat: number

  hull: Hull[]
}

export const createScopeData = (capacity: number): Scope => {
  return {
    amount: {
      nitrogen: 0,
      carbon: 0,
      fuel: 0,
      substance: 0,
      energy: 0,
    },
    capacity,
    heat: 0,
    hull: [],
  }
}