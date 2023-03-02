import { ComputeRequestUptake, Life, MaterialTransferRequest, MaterialTransferRequestType } from "./api_request"
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
  ) {
  }

  // FixMe: 実装感を掴むため
  public temp_calculateUptakeOperations(scope: Scope, operations: { life: Life, request: ComputeRequestUptake[] }): void {
    
  }

  public celculateScope(scope: Scope, operations: ScopeOperation[]): void {

  }

  // TODO: Scope間のMaterialTransfer

  public calculateTerrainCell(cell: TerrainCell, scopeUpdate: ScopeUpdate): void {
    const energyLoss = Math.floor(cell.amount.energy * this.physicalConstant.energyHeatConversionRate)
    scopeUpdate.amount.energy = - energyLoss + cell.energyProduction

    const heatLoss = Math.floor(cell.heat * this.physicalConstant.heatLossRate)
    scopeUpdate.heat = energyLoss - heatLoss
  }
}