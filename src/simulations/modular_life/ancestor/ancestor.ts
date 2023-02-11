import * as Module from "../module"

export const createAncestor = (code: Module.SourceCode): Module.Hull => {
  const modules: Module.InternalModule[] = [
    new Module.Compute(code),
    new Module.Assemble(),
  ]
  return new Module.Hull(modules)
}