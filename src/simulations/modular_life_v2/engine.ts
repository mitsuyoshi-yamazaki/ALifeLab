import { PhysicalConstant } from "./physics/physical_constant"
import { TerrainCell } from "./terrain"

export class Engine {
  public constructor(
    public readonly physicalConstant: PhysicalConstant,
  ) {
  }

  public calculateCell(cell: TerrainCell): void {
    const energyLoss = Math.floor(cell.amount.energy * this.physicalConstant.energyHeatConversionRate)
    cell.amount.energy = cell.amount.energy - energyLoss + cell.energyProduction
    cell.heat += energyLoss

    cell.heat = Math.floor(cell.heat * (1 - this.physicalConstant.heatLossRate))
  }
}