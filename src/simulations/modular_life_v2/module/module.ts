import type { Scope } from "../physics/scope"
import type { SourceCode } from "./source_code"

export type ModuleType = "computer" | "assembler" | "hull"
export const getShortModuleName = (moduleType: ModuleType): string => {
  switch (moduleType) {
  case "assembler":
    return "A"
  case "computer":
    return "C"
  case "hull":
    return "H"
  default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = moduleType
    throw new Error()
  }
  }
}

export type Module<T extends ModuleType> = {
  readonly case: T
}

export type AnyModule = Assembler | Computer | Hull
export type GenericModule<T extends ModuleType> = T extends "computer" ? Computer :
  T extends "assembler" ? Assembler :
  T extends "hull" ? Hull :
  never

export type InternalModuleType = Exclude<ModuleType, "hull">

export type Hull = Module<"hull"> & Scope & {
  hits: number
  readonly hitsMax: number
  readonly internalModules: { [M in InternalModuleType]: GenericModule<M>[] } // HullはScope.hullに入っている
  readonly size: number
}

export type Computer = Module<"computer"> & {
  readonly code: SourceCode
}

export type Assembler = Module<"assembler"> & {
}
