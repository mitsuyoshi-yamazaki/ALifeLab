import type { MaterialRecipeName, ProductionRecipe } from "./material"

export type PhysicalConstant = {
  readonly heatLossRate: number
  readonly energyHeatConversionRate: number
  readonly heatDamage: number
  readonly retainEnergyConsumptionRate: number
  readonly energyTransferResistance: number

  readonly materialProductionRecipe: { [RecipeName in MaterialRecipeName]: ProductionRecipe }
}