import { Vector } from "../../classes/physics"
import { createScopeData, Scope } from "./physics/scope"

export type TerrainCell = Scope & {
  energyProduction: number
}

export class Terrain {
  public get cells(): TerrainCell[][] {
    return this._cells
  }

  private _cells: TerrainCell[][]

  public constructor(
    public readonly size: Vector,
  ) {
    this._cells = (new Array(size.y)).fill(0).map((_, y) => (new Array(size.x)).fill(0).map((_, x): TerrainCell => {
      return {
        energyProduction: 0,
        ...createScopeData(`Cell(${x},${y})`, Infinity)
      }
    }))
  }
}