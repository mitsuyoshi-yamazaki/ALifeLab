import { Vector } from "../../classes/physics"

export class TerrainCell {
  energy = 0
  energyProduction = 0
  heat = 0
}

export class Terrain {
  public get cells(): TerrainCell[][] {
    return this._cells
  }

  private _cells: TerrainCell[][]

  public constructor(
    public readonly size: Vector,
  ) {
    this._cells = (new Array(size.y)).fill(0).map(() => (new Array(size.x)).fill(0).map(() => new TerrainCell()))
  }
}