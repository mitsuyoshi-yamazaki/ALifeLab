import type { Result } from "../../classes/result"
import type { Direction } from "./direction"
import type { EnergySource } from "./energy_source"
import type { ModuleType } from "./module/types"
import type { WorldObject } from "./types"

export type LookAroundResult = { [K in Direction]: WorldObject[] }

export type ComputerApi = {
  connectedModules(): ModuleType[]
  move(direction: Direction): Result<void, string>
  lookAround(): LookAroundResult
  harvest(energySource: EnergySource): Result<number, string>
}