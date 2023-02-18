import type { SourceCode } from "./source_code"
import { getShortModuleName, ModuleType } from "./types"

type ModuleSpecBase<T extends ModuleType> = {
  readonly case: T
  readonly hits: number
  readonly hitsMax: number
}
export type AssembleSpec = {
} & ModuleSpecBase<"assemble">

export type ComputeSpec = {
  readonly code: SourceCode
} & ModuleSpecBase<"compute">

export type HullSpec = {
  readonly energyAmount: number
} & ModuleSpecBase<"hull">

export type ModuleSpec = AssembleSpec | ComputeSpec | HullSpec

export type LifeSpec = {
  readonly hullSpec: HullSpec
  readonly internalModuleSpecs: (Exclude<ModuleSpec, HullSpec>)[]
}

export const describeLifeSpec = (spec: LifeSpec): string => {
  const internalModules = new Map<ModuleType, number>()
  spec.internalModuleSpecs.forEach(module => {
    const moduleCount = internalModules.get(module.case) ?? 0
    internalModules.set(module.case, moduleCount + 1)
  })

  const internalModuleDescriptions = Array.from(internalModules.entries()).map(([moduleType, count]): string => {
    return `${count}${getShortModuleName(moduleType)}`
  })

  return `H(${internalModuleDescriptions.join("")})`
}

const calculateModuleEnergyConsumption = (spec: ModuleSpec): number => {
  return Math.ceil(spec.hits + spec.hitsMax * 0.3)
}

export const calculateAssembleEnergyConsumption = (spec: LifeSpec): number => {
  const hullGeneration = calculateModuleEnergyConsumption(spec.hullSpec)
  const internalModuleGeneration = spec.internalModuleSpecs.reduce((result, moduleSpec) => {
    return result + calculateModuleEnergyConsumption(moduleSpec)
  }, 0)

  return spec.hullSpec.energyAmount + hullGeneration + internalModuleGeneration
}
