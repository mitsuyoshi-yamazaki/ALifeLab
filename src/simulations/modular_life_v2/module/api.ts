import type { NeighbourDirection } from "../physics/direction"
import type { MaterialAmountMap, MaterialType } from "../physics/material"
import type { AnyModuleDefinition, ModuleId, ModuleInterface, ModuleType } from "./module"

export type ComputerApi = {
  readonly physics: {
    getAssembleIngredientsFor(moduleDefinition: AnyModuleDefinition): MaterialAmountMap
  }

  readonly environment: {
    getEnvironmentalHeat(): number

    /// そのScopeに存在するModuleの総重量
    getWeight(): number
  }

  readonly status: {
    getStoredAmount(materialType: MaterialType): number
    getEnergyAmount(): number
    getHeat(): number

    getModules<M extends ModuleType>(moduleType: M): ModuleInterface<M>[]

    getWeight(): number
    getMoveEnergyConsumption(): number
  }

  readonly action: {
    say(message: string | null): void

    move(direction: NeighbourDirection): void
    uptake(moduleId: ModuleId<"channel">): void
    excretion(moduleId: ModuleId<"channel">): void
    synthesize(moduleId: ModuleId<"materialSynthesizer">): void
    assemble(moduleId: ModuleId<"assembler">, moduleDefinition: AnyModuleDefinition): void
  }
}
