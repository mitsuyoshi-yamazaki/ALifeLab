export type TerrainStatePlain = {
  readonly case: "plain"
  readonly energy: number
}
export type TerrainStateEnergySource = {
  readonly case: "energy source"
  readonly production: number
}
export type TerrainState = TerrainStatePlain | TerrainStateEnergySource
