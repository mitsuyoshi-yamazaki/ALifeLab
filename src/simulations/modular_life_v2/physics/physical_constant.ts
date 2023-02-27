import type { MaterialProductionSpec } from "./material"

export type PhysicalConstant = {
  readonly heatLossRate: number
  readonly energyHeatConversionRate: number

  readonly materialProduction: MaterialProductionSpec
}