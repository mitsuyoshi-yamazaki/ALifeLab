import { Life, MaterialTransferRequest, MaterialTransferRequestType } from "./api_request"
import { PhysicalConstant } from "./physics/physical_constant"
import { Scope } from "./physics/scope"
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

  public celculateScope(scope: Scope, operations: ScopeOperation[]): void {

  }

  // TODO: celculateScopeに統合する？
  public calculateCell(cell: TerrainCell): void {
    const energyLoss = Math.floor(cell.amount.energy * this.physicalConstant.energyHeatConversionRate)
    cell.amount.energy = cell.amount.energy - energyLoss + cell.energyProduction
    cell.heat += energyLoss

    cell.heat = Math.floor(cell.heat * (1 - this.physicalConstant.heatLossRate))
  }
}