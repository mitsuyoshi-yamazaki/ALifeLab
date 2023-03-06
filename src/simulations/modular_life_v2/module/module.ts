import type { MaterialRecipeName, TransferrableMaterialType } from "../physics/material"
import type { Scope } from "../physics/scope"
import type { SourceCode } from "./source_code"

export type ModuleType = "hull" | "computer" | "assembler" | "channel" | "mover" | "materialSynthesizer"

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Tag {
  const OpaqueTagSymbol: unique symbol

  class OpaqueTag<T> {
    private [OpaqueTagSymbol]: T;
  }
}

export type ModuleId<M extends ModuleType> = string & Tag.OpaqueTag<M>

type BaseModuleDefinition<M extends ModuleType> = {
  readonly case: M
}
type BaseModuleInterface<M extends ModuleType> = BaseModuleDefinition<M> & {
  readonly id: ModuleId<M>
}

export type HullDefinition = BaseModuleDefinition<"hull"> & {
  readonly size: number
}
export type HullInterface = BaseModuleInterface<"hull"> & Scope & HullDefinition & {
  readonly hits: number
  readonly hitsMax: number
}

export type ComputerDefinition = BaseModuleDefinition<"computer"> & {
  readonly code: SourceCode
}
export type ComputerInterface = BaseModuleInterface<"computer"> & ComputerDefinition & {
}

export type AssemblerDefinition = BaseModuleDefinition<"assembler"> & {
}
export type AssemblerInterface = BaseModuleInterface<"assembler"> & AssemblerDefinition & {
  readonly cooldown: number
}

export type ChannelDefinition = BaseModuleDefinition<"channel"> & {
  readonly materialType: TransferrableMaterialType
}
export type ChannelInterface = BaseModuleInterface<"channel"> & ChannelDefinition & {
}

export type MoverDefinition = BaseModuleDefinition<"mover"> & {
}
export type MoverInterface = BaseModuleInterface<"mover"> & MoverDefinition & {
}

export type MaterialSynthesizerDefinition = BaseModuleDefinition<"materialSynthesizer"> & {
  readonly recipeName: MaterialRecipeName
}
export type MaterialSynthesizerInterface = BaseModuleInterface<"materialSynthesizer"> & MaterialSynthesizerDefinition & {
}

export type AnyModuleDefinition = AssemblerDefinition | ComputerDefinition | HullDefinition | ChannelDefinition | MoverDefinition | MaterialSynthesizerDefinition

// Omit<ModuleInterface<M>, "id"> 等型の再構成を行うと case: M が case: ModuleType へ再構成され、switch-caseが効かなくなってしまうため
export type ModuleDefinition<T extends ModuleType> = T extends "computer" ? ComputerDefinition :
  T extends "assembler" ? AssemblerDefinition :
  T extends "hull" ? HullDefinition :
  T extends "channel" ? ChannelDefinition :
  T extends "mover" ? MoverDefinition :
  T extends "materialSynthesizer" ? MaterialSynthesizerDefinition :
  never

export type AnyModuleInterface = AssemblerInterface | ComputerInterface | HullInterface | ChannelInterface | MoverInterface | MaterialSynthesizerInterface
export type ModuleInterface<T extends ModuleType> = T extends "computer" ? ComputerInterface :
  T extends "assembler" ? AssemblerInterface :
  T extends "hull" ? HullInterface :
  T extends "channel" ? ChannelInterface :
  T extends "mover" ? MoverInterface :
  T extends "materialSynthesizer" ? MaterialSynthesizerInterface :
  never

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

let moduleIdIndex = 0
export const createModuleId = <M extends ModuleType>(): ModuleId<M> => {
  const index = moduleIdIndex
  moduleIdIndex += 1
  return `${index}` as ModuleId<M>
}