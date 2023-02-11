import { Module } from "./types"
import { Result } from "../../../classes/result"
import { Hull } from "./hull"
import { Compute } from "./compute"
import { createId } from "./module_id"
import { AnyModule } from "./any_module"
import type { AssembleSpec } from "../types"

export const isAssemble = (module: AnyModule): module is Assemble => {
  return module.type === "assemble"
}

export class Assemble implements Module<"assemble"> {
  public readonly id: number
  public readonly name = "Assembler"
  public readonly type = "assemble"

  public get assembling(): Hull | null {
    return this._assembling
  }

  private _assembling: Hull | null = null

  public constructor(
  ) {
    this.id = createId()
  }

  public assemble(spec: AssembleSpec): Result<void, string> {
    if (this.assembling != null) {
      return Result.Failed("already assembling")
    }

    this._assembling = new Hull([new Compute(spec.code), new Assemble()])
    return Result.Succeeded(undefined)
  }

  public release(): Hull | null {
    if (this.assembling == null) {
      return null
    }
    const assembling = this.assembling
    this._assembling = null
    return assembling
  }
}