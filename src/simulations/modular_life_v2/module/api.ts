import type { NeighbourDirection } from "../physics/direction"
import type { MaterialRecipeName, MaterialType, TransferrableMaterialType } from "../physics/material"
import type { AnyModuleInterface, ModuleType } from "./module"

export type ComputerApi = {
  getStoredAmount(materialType: MaterialType): number
  getEnergyAmount(): number
  getHeat(): number

  modules(): AnyModuleInterface[]

  move(direction: NeighbourDirection): void
  uptake(materialType: TransferrableMaterialType, numberOfChannels: number): void
  excretion(materialType: TransferrableMaterialType, numberOfChannels: number): void
  synthesize(recipe: MaterialRecipeName): void
  assemble(moduleType: ModuleType): void
}
