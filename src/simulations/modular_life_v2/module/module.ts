import type { MaterialRecipeName, TransferrableMaterialType } from "../physics/material"
import type { Scope } from "../physics/scope"
import type { SourceCode } from "./source_code"

export type HullInterface = Scope & {
  readonly case: "hull"
  readonly hits: number
  readonly hitsMax: number
  // readonly internalModules: { [M in InternalModuleType]: Module<M>[] } // HullはScope.hullに入っている
  readonly size: number
}

export type ComputerInterface = {
  readonly case: "computer"
  readonly code: SourceCode
}

export type AssemblerInterface = {
  readonly case: "assembler"
}

export type ChannelInterface = {
  readonly case: "channel"
  readonly materialType: TransferrableMaterialType
}

export type MoverInterface = {
  readonly case: "mover"
}

export type MaterialSynthesizerInterface = {
  readonly case: "materialSynthesizer"
  readonly recipeName: MaterialRecipeName
}

export type AnyModuleInterface = AssemblerInterface | ComputerInterface | HullInterface | ChannelInterface | MoverInterface | MaterialSynthesizerInterface
export type ModuleInterface<T extends ModuleType> = T extends "computer" ? ComputerInterface :
  T extends "assembler" ? AssemblerInterface :
  T extends "hull" ? HullInterface :
  T extends "channel" ? ChannelInterface :
  T extends "mover" ? MoverInterface :
  T extends "materialSynthesizer" ? MaterialSynthesizerInterface :
  never
  
export type ModuleType = AnyModuleInterface["case"]
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
