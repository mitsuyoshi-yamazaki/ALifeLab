import { Module } from "./types"
import { Result } from "../../../classes/result"
import { worldDelegate } from "../world_delegate"
import { Hull } from "./hull"
import { Compute, SourceCode } from "./compute"
import { createId } from "./module_id"
import { AnyModule } from "./any_module"

export type AssembleSpec = {
  // 現状はHull(Compute, Assemble)の一種類のみ
  readonly code: SourceCode
}

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

  private _assembling: Hull | null

  public constructor(
  ) {
    this.id = createId()
  }

  public assemble(spec: AssembleSpec): Result<Hull, string> {
    if (this.assembling != null) {
      return Result.Failed("already assembling")
    }

    this._assembling = new Hull([new Compute(spec.code), new Assemble()])
    return Result.Succeeded(this._assembling)
  }

  /// assemblingを独立したエージェントとして環境に放つ
  public release(): Result<void, string> {
    if (this.assembling == null) {
      return Result.Failed("no module to release")
    }

    worldDelegate.delegate?.addLife(this.assembling)
    return Result.Succeeded(undefined)
  }
}