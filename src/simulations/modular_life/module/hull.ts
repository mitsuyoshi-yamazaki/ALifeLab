import type { AnyModule } from "./any_module"
import { Module } from "./types"

export type InternalModule = Exclude<AnyModule, Hull>

export class Hull implements Module<"hull"> {
  public readonly name = "Hull"
  public readonly type = "hull"

  public constructor(
    private readonly internalModules: InternalModule[],
  ) {
  }
}