import type { ComputerApi } from "./api"
import type { EnergySource } from "./energy_source"
import type { Environment } from "./environment"
import type { Hull } from "./module"

export type WorldObject = Hull | EnergySource

export type AssembleSpec = {
  // TODO: 現状はHull(Compute, Assemble)の一種類のみ
  readonly code: SourceCode
}

export type SourceCode = ([api, environment]: ComputeArgument) => void

export type ComputeArgument = [ComputerApi, Environment]
