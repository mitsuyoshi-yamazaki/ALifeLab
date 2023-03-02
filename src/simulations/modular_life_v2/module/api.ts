import type { NeighbourDirection } from "../physics/direction"
import type { MaterialRecipeName, MaterialType, TransferrableMaterialType } from "../physics/material"
import type { AnyModule, ModuleType } from "./module"

export type ComputerApi = {
  getStoredAmount(materialType: MaterialType): number
  getEnergyAmount(): number
  getHeat(): number

  modules(): AnyModule[]

  move(direction: NeighbourDirection): void
  uptake(materialType: TransferrableMaterialType, amount: number): void
  excretion(materialType: TransferrableMaterialType, amount: number): void
  synthesize(recipe: MaterialRecipeName): void
  assemble(moduleType: ModuleType): void
}
