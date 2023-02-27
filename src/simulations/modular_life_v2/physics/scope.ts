import { Hull } from "../module/module"
import { MaterialType, Energy } from "../physics/material"

type MaterialStore = { [Material in (MaterialType | Energy)]: number }

export type Scope = {
  readonly amount: MaterialStore
  capacity: number
  heat: number

  hull: Hull[]
}