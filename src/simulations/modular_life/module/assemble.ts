import { Module } from "./types"
import { Result } from "../../../classes/result"
import type { AnyModule } from "./any_module"

export type AssembleSpec = {
}

export class Assemble implements Module<"assemble"> {
  public readonly name = "Assembler"
  public readonly type = "assemble"

  public get assembling(): AnyModule[] | null {
    return this._assembling
  }

  private _assembling: AnyModule[] | null

  public assemble(specs: AssembleSpec[]): Result<AnyModule[], string> {
    return Result.Failed("not implemented")
  }
}