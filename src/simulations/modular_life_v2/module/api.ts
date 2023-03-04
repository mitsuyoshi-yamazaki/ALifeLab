import type { NeighbourDirection } from "../physics/direction"
import type { MaterialType, TransferrableMaterialType } from "../physics/material"
import type { AnyModuleDefinition, ModuleId, ModuleInterface, ModuleType } from "./module"

export type ComputerApi = {
  getStoredAmount(materialType: MaterialType): number
  getEnergyAmount(): number
  getHeat(): number

  getModules<M extends ModuleType>(moduleType: M): ModuleInterface<M>[]

  move(direction: NeighbourDirection): void
  uptake(materialType: TransferrableMaterialType, moduleId: ModuleId<"channel">): void
  excretion(materialType: TransferrableMaterialType, moduleId: ModuleId<"channel">): void
  synthesize(moduleId: ModuleId<"materialSynthesizer">): void
  assemble(moduleId: ModuleId<"assembler">, moduleDefinition: AnyModuleDefinition): void
}
