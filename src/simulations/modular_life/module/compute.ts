import { ComputeArgument, SourceCode } from "../primitive/types"
import { AnyModule } from "./any_module"
import { createId } from "./module_id"
import { Module } from "./types"

export const isCompute = (module: AnyModule): module is Compute => {
  return module.type === "compute"
}

export class Compute implements Module<"compute"> {
  public readonly id: number
  readonly name = "Computer"
  readonly type = "compute"

  public constructor(
    public readonly code: SourceCode,
  ) {
    this.id = createId()
  }

  public run(args: ComputeArgument): void {
    this.code(args)
  }
}