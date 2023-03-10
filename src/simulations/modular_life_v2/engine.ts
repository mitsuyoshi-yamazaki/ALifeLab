import { Vector } from "../../classes/physics"
import { Result } from "../../classes/result"
import { strictEntries } from "../../classes/utilities"
import { ComputeRequestAssemble, ComputeRequestExcretion, ComputeRequestSynthesize, ComputeRequestUptake, GenericComputeRequest, Life, MaterialTransferRequestType } from "./api_request"
import { Logger } from "./logger"
import { AnyModuleDefinition } from "./module/module"
import { AnyModule, createModule, InternalModuleType } from "./module/module_object/module_object"
import { ModuleSpec } from "./module/module_spec"
import { MaterialAmountMap, materialProductionRecipes } from "./physics/material"
import { PhysicalConstant } from "./physics/physical_constant"
import { Scope } from "./physics/scope"
import { TerrainCell } from "./terrain"

export type ScopeOperation = {
  readonly life: Life
  readonly requests: { [T in MaterialTransferRequestType]: GenericComputeRequest<T>[]}  
}

type MassTransfer = {
  readonly top: number
  readonly left: number
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

  private runAssemble(materialStore: Scope, requests: ComputeRequestAssemble[]): void {
    requests.forEach(request => {
      const ingredients = this.getAssembleIngredientsFor(request.moduleDefinition)
      if (this.hasEnoughIngredients(materialStore, ingredients) !== true) {
        return
      }
      this.consumeMaterials(materialStore, ingredients)

      switch (request.moduleDefinition.case) {
      case "hull":
        request.targetHull.hull.push(createModule<"hull">(request.moduleDefinition))
        break
      case "assembler":
      case "computer":
      case "channel":
      case "mover":
      case "materialSynthesizer":
        request.targetHull.addInternalModule(createModule<InternalModuleType>(request.moduleDefinition))
        break
      default: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = request.moduleDefinition
        break
      }
      }
    })
  }

  public getAssembleIngredientsFor(moduleDefinition: AnyModuleDefinition): MaterialAmountMap {
    return ModuleSpec.moduleIngredients[moduleDefinition.case]
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
    let remainingCapacity = life.capacity - Array.from(Object.values(life.amount)).reduce((result, current) => result + current, 0)

    requests.forEach(request => {
      const materialType = request.module.materialType
      const amount = Math.min(scope.scopeUpdate.amount[materialType], ModuleSpec.modules.channel.maxTransferAmount, remainingCapacity)
      if (amount <= 0) {
        return
      }

      remainingCapacity -= amount
      scope.scopeUpdate.amount[materialType] -= amount
      life.scopeUpdate.amount[materialType] += amount
    })
  }

  private runExcretion(scope: Scope, life: Life, requests: ComputeRequestExcretion[]): void {
    requests.forEach(request => {
      const materialType = request.module.materialType
      const amount = Math.min(life.scopeUpdate.amount[materialType], ModuleSpec.modules.channel.maxTransferAmount)
      if (amount <= 0) {
        return
      }

      life.scopeUpdate.amount[materialType] -= amount
      scope.scopeUpdate.amount[materialType] += amount
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

  private addMaterials(scope: Scope, materials: MaterialAmountMap): void {
    strictEntries(materials).forEach(([material, amount]) => {
      if (amount == null) {
        return
      }
      scope.scopeUpdate.amount[material] += amount
    })
  }

  public calculateCellEnergyTransfer(size: Vector, cells: TerrainCell[][]): void {
    const energyTransferResistance = this.physicalConstant.energyTransferResistance

    const massTransfer: MassTransfer[][] = []
    const getAllTransfer = (x: number, y: number): number => {
      let result = 0
      const transfer = massTransfer[y][x]
      result += transfer.top
      result += transfer.left

      const bottomY = (y + 1) % size.y
      const bottomTransfer = massTransfer[bottomY][x]
      result -= bottomTransfer.top

      const rightX = (x + 1) % size.x
      const rightTransfer = massTransfer[y][rightX]
      result -= rightTransfer.left

      return result
    }

    cells.forEach((row, y) => {
      const transferRow: MassTransfer[] = []
      massTransfer.push(transferRow)

      row.forEach((cell, x) => {
        const topY = (y - 1 + size.y) % size.y
        const topCell = cells[topY][x]
        const top = Math.floor((topCell.scopeUpdate.amount.energy - cell.scopeUpdate.amount.energy) / energyTransferResistance)

        const leftX = (x - 1 + size.x) % size.x
        const leftCell = cells[y][leftX]
        const left = Math.floor((leftCell.scopeUpdate.amount.energy - cell.scopeUpdate.amount.energy) / energyTransferResistance)

        transferRow.push({
          top,
          left,
        })
      })
    })

    cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        cell.scopeUpdate.amount.energy += getAllTransfer(x, y)

        this.calculateTerrainCell(cell)
      })
    })
  }

  private calculateTerrainCell(cell: TerrainCell): void {
    cell.scopeUpdate.amount.energy += cell.energyProduction
    const energyLoss = Math.floor(cell.scopeUpdate.amount.energy * this.physicalConstant.energyHeatConversionRate)
    cell.scopeUpdate.amount.energy -= energyLoss

    cell.scopeUpdate.heat += energyLoss
    const heatLoss = Math.floor(cell.scopeUpdate.heat * this.physicalConstant.heatLossRate)
    cell.scopeUpdate.heat -= heatLoss
  }

  public calculateLifeScope(life: Life): void {
    const heatLoss = Math.floor(life.scopeUpdate.heat * this.physicalConstant.heatLossRate)
    life.scopeUpdate.heat -= heatLoss
  }

  public move(life: Life, inScope: Scope): Result<number, string> {
    const energyConsumption = this.calculateMoveEnergyConsumption(life)
    if (life.scopeUpdate.amount.energy < energyConsumption) {
      return Result.Failed(`lack of energy (${life.scopeUpdate.amount.energy} < ${energyConsumption})`)
    }

    life.scopeUpdate.amount.energy -= energyConsumption
    inScope.scopeUpdate.heat += energyConsumption

    return Result.Succeeded(energyConsumption)
  }

  public calculateHeatDamage(life: Life, inScope: Scope): void {
    life.hits -= Math.ceil(inScope.scopeUpdate.heat * this.physicalConstant.heatDamage)

    if (life.hits > 0) {
      return
    }

    inScope.scopeUpdate.hullToRemove.add(life)
    life.hull.forEach(hull => inScope.scopeUpdate.hullToAdd.add(hull))

    this.addMaterials(inScope, life.scopeUpdate.amount)
    inScope.scopeUpdate.heat += life.scopeUpdate.heat

    const addModuleIngredients = (module: AnyModule): void => {
      const ingredients = ModuleSpec.moduleIngredients[module.case]
      this.addMaterials(inScope, ingredients)
    }

    addModuleIngredients(life)
    life.allInternalModules().forEach(module => addModuleIngredients(module))
  }

  public calculateMoveEnergyConsumption(life: Life): number {
    return Math.ceil(ModuleSpec.modules.mover.energyConsumption * life.getWeight())
  }
}