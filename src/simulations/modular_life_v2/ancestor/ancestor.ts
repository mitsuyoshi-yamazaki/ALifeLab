import * as Module from "../module"
import { SourceCode } from "../module/source_code"

export const createAncestor = (code: SourceCode): Module.Hull => {
  const modules: Module.InternalModule[] = [
    new Module.Compute(code, 50, 50),
    new Module.Assemble(50, 50),
  ]
  return new Module.Hull(modules, 1000, 50, 50)  
}