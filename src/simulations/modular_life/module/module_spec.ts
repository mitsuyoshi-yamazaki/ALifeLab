import type { SourceCode } from "./source_code"
import { getShortModuleName, ModuleType } from "./types"

type ModuleSpecBase<T extends ModuleType> = {
  readonly case: T
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

const moduleAssembleEnergyConsumption: { [T in ModuleType]: number } = {
  hull: 100,
  assemble: 100,
  compute: 50,
}

export const calculateAssembleEnergyConsumption = (spec: LifeSpec): number => {
  const hullGeneration = moduleAssembleEnergyConsumption["hull"]
  const internalModuleGeneration = spec.internalModuleSpecs.reduce((result, module) => {
    return result + moduleAssembleEnergyConsumption[module.case]
  }, 0)

  return spec.hullSpec.energyAmount + hullGeneration + internalModuleGeneration
}
