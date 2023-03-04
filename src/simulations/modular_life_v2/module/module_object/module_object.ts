import { ModuleInterface, ModuleType } from "../module"
import { Assembler } from "./assembler"
import { Channel } from "./channel"
import { Computer } from "./computer"
import { Hull } from "./hull"
import { MaterialSynthesizer } from "./material_synthesizer"
import { Mover } from "./mover"

export type AnyModule = Assembler | Computer | Hull | Channel | Mover | MaterialSynthesizer

export type Module<T extends ModuleType> = T extends "computer" ? Computer :
  T extends "assembler" ? Assembler :
  T extends "hull" ? Hull :
  T extends "channel" ? Channel :
  T extends "mover" ? Mover :
  T extends "materialSynthesizer" ? MaterialSynthesizer :
  never
  

export type InternalModule = Exclude<AnyModule, Hull>
export type InternalModuleType = InternalModule["case"]

export const createModule = <M extends ModuleType>(moduleDefinition: ModuleInterface<M>): Module<M> => {
  switch (moduleDefinition.case) {
  case "hull":
    return new Hull(moduleDefinition.size) as Module<M>
  case "computer":
    return new Computer(moduleDefinition.code) as Module<M>
  case "assembler":
    return new Assembler() as Module<M>
  case "channel":
    return new Channel(moduleDefinition.materialType) as Module<M>
  case "mover":
    return new Mover() as Module<M>
  case "materialSynthesizer":
    return new MaterialSynthesizer(moduleDefinition.recipeName) as Module<M>
  }
}