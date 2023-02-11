import * as Module from "../module"
import { SourceCode } from "../module/source_code"

export const createAncestor = (code: SourceCode): Module.Hull => {
  const modules: Module.InternalModule[] = [
    new Module.Compute(code),
    new Module.Assemble(),
  ]
  return new Module.Hull(modules, 1000)  
}