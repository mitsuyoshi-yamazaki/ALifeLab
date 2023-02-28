import { ProductionRecipe } from "./material"

export type PhysicalConstant = {
  readonly heatLossRate: number
  readonly energyHeatConversionRate: number

  readonly materialProductionRecipe: Map<string, ProductionRecipe>
}