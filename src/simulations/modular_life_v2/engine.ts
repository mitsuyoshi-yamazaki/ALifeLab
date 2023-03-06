import { strictEntries } from "../../classes/utilities"
import { ComputeRequestAssemble, ComputeRequestExcretion, ComputeRequestSynthesize, ComputeRequestUptake, GenericComputeRequest, Life, MaterialTransferRequestType } from "./api_request"
import { Logger } from "./logger"
import { Hull } from "./module/module_object/hull"
import { createModule, InternalModuleType } from "./module/module_object/module_object"
import { ModuleSpec } from "./module/module_spec"
import { MaterialAmountMap, materialProductionRecipes } from "./physics/material"
import { PhysicalConstant } from "./physics/physical_constant"
import { Scope, ScopeUpdate } from "./physics/scope"
import { TerrainCell } from "./terrain"

export type ScopeOperation = {
  readonly life: Life
  readonly requests: { [T in MaterialTransferRequestType]: GenericComputeRequest<T>[]}  
}

export class Engine {
  public constructor(
    public readonly physicalConstant: PhysicalConstant,
    public readonly logger: Logger,
  ) {
  }

  public celculateScope(scope: Scope, operations: ScopeOperation[]): void {
    const prioritizedOperations = operations.map(operation => ({ weight: operation.life.getWeight(), ...operation }))
    prioritizedOperations.sort((lhs, rhs) => lhs.weight - rhs.weight) // 実行順序は仮

    prioritizedOperations.forEach(operation => {
      const assembleRequests = operation.requests.assemble
      if (assembleRequests.length > 0) {
        this.runAssemble(operation.life, assembleRequests)
      }

      const synthesizeRequests = operation.requests.synthesize
      if (synthesizeRequests.length > 0) {
        this.runSynthesize(operation.life, synthesizeRequests)
      }

      const uptakeRequests = operation.requests.uptake
      if (uptakeRequests.length > 0) {
        this.runUptake(scope, operation.life, uptakeRequests)
      }

      const excretionRequests = operation.requests.excretion
      if (excretionRequests.length > 0) {
        this.runExcretion(scope, operation.life, excretionRequests)
      }
    })
  }

  private runAssemble(life: Life, requests: ComputeRequestAssemble[]): void {
    if (life.hull[0] != null) {
      this.assemble(life, life.hull[0], requests)
    } else {
      this.assemble(life, life, requests)
    }
  }

  private assemble(materialStore: Scope, hull: Hull, requests: ComputeRequestAssemble[]): void {
    requests.forEach(request => {
      const ingredients = ModuleSpec.moduleIngredients[request.moduleDefinition.case]
      if (this.hasEnoughIngredients(materialStore, ingredients) !== true) {
        return
      }
      this.consumeMaterials(materialStore, ingredients)
      hull.addInternalModule(createModule<InternalModuleType>(request.moduleDefinition))
    })
  }

  private runSynthesize(life: Life, requests: ComputeRequestSynthesize[]): void {
    requests.forEach(request => {
      const recipe = materialProductionRecipes[request.module.recipeName]
      if (this.hasEnoughIngredients(life, recipe.ingredients) !== true) {
        return
      }
      this.consumeMaterials(life, recipe.ingredients)
      this.addMaterials(life, recipe.productions)

      life.scopeUpdate.heat += recipe.heatProduction
    })
  }

  private runUptake(scope: Scope, life: Life, requests: ComputeRequestUptake[]): void {
    requests.forEach(request => {
      const amount = Math.min(scope.scopeUpdate.amount[request.materialType], ModuleSpec.modules.channel.maxTransferAmount)
      if (amount <= 0) {
        return
      }

      scope.scopeUpdate.amount[request.materialType] -= amount
      life.scopeUpdate.amount[request.materialType] += amount
    })
  }

  private runExcretion(scope: Scope, life: Life, requests: ComputeRequestExcretion[]): void {
    requests.forEach(request => {
      const amount = Math.min(life.scopeUpdate.amount[request.materialType], ModuleSpec.modules.channel.maxTransferAmount)
      if (amount <= 0) {
        return
      }

      life.scopeUpdate.amount[request.materialType] -= amount
      scope.scopeUpdate.amount[request.materialType] += amount
    })
  }

  private hasEnoughIngredients(scope: Scope, ingredients: MaterialAmountMap): boolean {
    return strictEntries(ingredients).every(([material, amount]) => amount == null || scope.scopeUpdate.amount[material] >= amount)
  }

  private consumeMaterials(scope: Scope, ingredients: MaterialAmountMap): void {
    strictEntries(ingredients).forEach(([material, amount]) => {
      if (amount == null) {
        return
      }
      scope.scopeUpdate.amount[material] -= amount
    })
  }

  private addMaterials(scope: Scope, productions: MaterialAmountMap): void {
    strictEntries(productions).forEach(([material, amount]) => {
      if (amount == null) {
        return
      }
      scope.scopeUpdate.amount[material] += amount
    })
  }

  public calculateTerrainCell(cell: TerrainCell, scopeUpdate: ScopeUpdate): void {
    const energyLoss = Math.floor(cell.scopeUpdate.amount.energy * this.physicalConstant.energyHeatConversionRate)
    scopeUpdate.amount.energy += Math.max(cell.energyProduction - energyLoss, 0)

    const heatLoss = Math.floor(cell.scopeUpdate.heat * this.physicalConstant.heatLossRate)
    scopeUpdate.heat += Math.max(energyLoss - heatLoss, 0)
  }
}