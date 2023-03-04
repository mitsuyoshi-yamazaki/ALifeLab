import { ValuedArrayMap } from "../../classes/utilities"
import { ComputeRequestUptake, Life, MaterialTransferRequest, MaterialTransferRequestType } from "./api_request"
import { Logger } from "./logger"
import { TransferrableMaterialType } from "./physics/material"
import { PhysicalConstant } from "./physics/physical_constant"
import { Scope, ScopeUpdate } from "./physics/scope"
import { TerrainCell } from "./terrain"

export type ScopeOperation = {
  readonly life: Life
  readonly requests: Map<MaterialTransferRequestType, MaterialTransferRequest[]>
}

export class Engine {
  public constructor(
    public readonly physicalConstant: PhysicalConstant,
    public readonly logger: Logger,
  ) {
  }

  // FixMe: 実装感を掴むため仮実装
  public temp_calculateUptakeOperations(scope: Scope, operations: { life: Life, requests: ComputeRequestUptake[] }[]): void {
    const operationsByMaterialType = new ValuedArrayMap<TransferrableMaterialType, { life: Life, amount: number }>()

    operations.forEach(({ life, requests }) => {
      requests.forEach(request => {
        operationsByMaterialType.getValueFor(request.materialType).push({
          life,
          amount: request.amount,
        })
      })
    })

    Array.from(operationsByMaterialType.entries()).forEach(([materialType, operations]) => {
      this.temp_calculateMaterialUptakeOperations(scope, materialType, operations)
    })
  }

  private temp_calculateMaterialUptakeOperations(scope: Scope, materialType: TransferrableMaterialType, operations: { life: Life, amount: number }[]): void {
    const totalAmount = operations.reduce((result, current) => result + current.amount, 0)
    if (scope.amount[materialType] < totalAmount) {
      if (operations.length <= 1 && operations[0] != null) {
        const amount = scope.amount[materialType]
        scope.scopeUpdate.amount[materialType] -= amount

        const life = operations[0].life
        life.scopeUpdate.amount[materialType] += amount

      } else {
        // TODO: 分割なりして動作するようにする
        this.logger.debug(`Scope (${scope.scopeId}) doesn't have enough ${materialType} (${scope.amount[materialType]} < ${totalAmount})`)
      }
      return
    }

    const scopeUpdate = ((): ScopeUpdate => {
      return scope.scopeUpdate
    })()

    operations.forEach(({ life, amount }) => {
      scopeUpdate.amount[materialType] -= amount

      life.scopeUpdate.amount[materialType] += amount
    })
  }

  public celculateScope(scope: Scope, operations: ScopeOperation[]): void {
    
  }

  // TODO: Scope間のMaterialTransfer

  public calculateTerrainCell(cell: TerrainCell, scopeUpdate: ScopeUpdate): void {
    const energyLoss = Math.floor(cell.amount.energy * this.physicalConstant.energyHeatConversionRate)
    scopeUpdate.amount.energy += - energyLoss + cell.energyProduction

    const heatLoss = Math.floor(cell.heat * this.physicalConstant.heatLossRate)
    scopeUpdate.heat += energyLoss - heatLoss
  }
}