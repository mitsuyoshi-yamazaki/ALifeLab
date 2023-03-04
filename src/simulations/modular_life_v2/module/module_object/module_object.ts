import { ModuleType } from "../module"
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
