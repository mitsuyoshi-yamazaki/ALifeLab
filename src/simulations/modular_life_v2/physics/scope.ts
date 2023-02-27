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
      energy: 0,
      red: 0,
      green: 0,
      blue: 0,
    },
    capacity,
    heat: 0,
    hull: [],
  }
}