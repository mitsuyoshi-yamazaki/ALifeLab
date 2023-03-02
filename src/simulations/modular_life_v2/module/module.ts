import type { MaterialRecipeName } from "../physics/material"
import type { Scope } from "../physics/scope"
import type { SourceCode } from "./source_code"

export type Hull = Scope & {
  readonly case: "hull"
  hits: number
  readonly hitsMax: number
  readonly internalModules: { [M in InternalModuleType]: Module<M>[] } // HullはScope.hullに入っている
  readonly size: number
}

export type Computer = {
  readonly case: "computer"
  readonly code: SourceCode
}

export type Assembler = {
  readonly case: "assembler"
}

export type Channel = {
  readonly case: "channel"
}

export type Mover = {
  readonly case: "mover"
}

export type MaterialSynthesizer = {
  readonly case: "materialSynthesizer"
  readonly recipeName: MaterialRecipeName
}

export type AnyModule = Assembler | Computer | Hull | Channel | Mover | MaterialSynthesizer
export type Module<T extends ModuleType> = T extends "computer" ? Computer :
  T extends "assembler" ? Assembler :
  T extends "hull" ? Hull :
  T extends "channel" ? Channel :
  T extends "mover" ? Mover :
  T extends "materialSynthesizer" ? MaterialSynthesizer :
  never
  
export type ModuleType = AnyModule["case"]
export const getShortModuleName = (moduleType: ModuleType): string => {
  switch (moduleType) {
  case "assembler":
    return "A"
  case "computer":
    return "Co"
  case "hull":
    return "H"
  case "channel":
    return "Ch"
  case "mover":
    return "M"
  case "materialSynthesizer":
    return "S"
  default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = moduleType
    throw new Error()
  }
  }
}

export type InternalModuleType = Exclude<ModuleType, "hull">
