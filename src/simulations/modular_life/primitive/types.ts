import type { ComputerApi } from "../module/api"
import type { Environment } from "./environment"
import { getShortModuleName, ModuleType } from "../module"

type ModuleSpecBase<T extends ModuleType> = {
  readonly case: T
}
export type AssembleSpec = {
} & ModuleSpecBase<"assemble">

export type ComputeSpec = {
  readonly code: SourceCode
} & ModuleSpecBase<"compute">

export type HullSpec = {
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

export type SourceCode = ([api, environment]: ComputeArgument) => void

export type ComputeArgument = [ComputerApi, Environment]
