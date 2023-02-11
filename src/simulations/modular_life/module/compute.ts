import { ComputeArgument, SourceCode } from "../primitive/types"
import { AnyModule } from "./any_module"
import { Module } from "./types"

export const isCompute = (module: AnyModule): module is Compute => {
  return module.type === "compute"
}

export class Compute extends Module<"compute"> {
  readonly name = "Computer"
  readonly type = "compute"

  public constructor(
    public readonly code: SourceCode,
  ) {
    super()
  }

  public run(args: ComputeArgument): void {
    this.code(args)
  }
}