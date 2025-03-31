// TODO: トランザクション（Request）を実装する

import { Terrain } from "../objects/terrain"

export const directions = [
  "top",
  "bottom",
  "left",
  "right",
] as const
export type Direction = typeof directions[number]

export type LookResult = {[K in Direction]: Terrain}
export type MoveResult = void  // TODO:
export type SpawnResult = void // TODO:
export type HarvestResult = void // TODO:

export interface LifeApi {
  time(): number

  lookAround(): LookResult
  move(direction: Direction): MoveResult
  spawn(direction: Direction): SpawnResult
  harvest(): HarvestResult
}
