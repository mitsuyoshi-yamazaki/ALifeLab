import { Result } from "../../classes/result"
import { guardPositionArgument, Vector } from "../../classes/physics"
import { Direction, getDirectionVector } from "./physics/direction"
import type { ComputerApi } from "./module/api"
import { Logger } from "./logger"
import { Terrain, TerrainCell } from "./terrain"
import { PhysicalConstant } from "./physics/physical_constant"

type Life = unknown // FixMe:

export class World {
  public get t(): number {
    return this._t
  }
  public get terrain(): Terrain {
    return this._terrain
  }
  
  private _t = 0
  private _terrain: Terrain

  public constructor(
    public readonly size: Vector,
    public readonly logger: Logger,
    public readonly physicalConstant: PhysicalConstant,
  ) {
    this._terrain = new Terrain(size)
  }

  public addAncestor(life: Life, atPosition: Vector): Result<void, string> {
    return Result.Failed("not implemented")
  }

  private addLife(hull: Life, atPosition: Vector, parent: Life): Result<void, string> {
    return Result.Failed("not implemented")
  }

  public setEnergyProductionAt(x: number, y: number, energyProduction: number): void {
    this.terrain.cells[y][x].energyProduction = energyProduction
  }

  public run(step: number): void {
    for (let i = 0; i < step; i += 1) {
      this.step()
    }
  }

  private step(): void {
    const {energyHeatConversionRate, heatLossRate} = this.physicalConstant

    this.terrain.cells.forEach(row => {
      row.forEach(cell => {
        const energyLoss = Math.floor(cell.energy * energyHeatConversionRate)
        cell.energy = cell.energy - energyLoss + cell.energyProduction
        cell.heat += energyLoss

        cell.heat = Math.floor(cell.heat * (1 - heatLossRate))
      })
    })

    this._t += 1
  }

  private getNewPosition(origin: Vector, direction: Direction): Vector {
    const directionVector = getDirectionVector(direction)
    return new Vector(
      (origin.x + directionVector.x + this.size.x) % this.size.x,
      (origin.y + directionVector.y + this.size.y) % this.size.y,
    )
  }

  private getTerrainCellAt(position: Vector): TerrainCell
  private getTerrainCellAt(x: number, y: number): TerrainCell
  private getTerrainCellAt(...args: [Vector] | [number, number]): TerrainCell {
    const { x, y } = ((): { x: number, y: number } => {
      if (guardPositionArgument(args)) {
        return args[0]
      }

      return {
        x: args[0],
        y: args[1],
      }
    })()

    return this.terrain.cells[y][x]
  }

  // ---- API ---- //
  private createApiFor(life: Life): ComputerApi {
    return {
    }
  }

  /// 世界に対して働きかけるAPI呼び出しのログ出力
  private logActiveApiCall(life: Life, message: string): void {
    // this.logger.debug(`Life[${life.hull.id}] at ${life.position} ${message}`)
  }
}
