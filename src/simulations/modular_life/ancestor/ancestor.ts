import * as Module from "../module"
import type { SourceCode } from "../primitive/types"

export const createAncestor = (code: SourceCode): Module.Hull => {
  const modules: Module.InternalModule[] = [
    new Module.Compute(code),
    new Module.Assemble(),
  ]
  return new Module.Hull(modules)
}