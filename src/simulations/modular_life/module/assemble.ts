import { Module } from "./types"
import { Result } from "../../../classes/result"
import { Hull, InternalModule } from "./hull"
import { Compute } from "./compute"
import { AnyModule } from "./any_module"
import { LifeSpec } from "./module_spec"

export const isAssemble = (module: AnyModule): module is Assemble => {
  return module.type === "assemble"
}

export class Assemble extends Module<"assemble"> {
  public readonly name = "Assembler"
  public readonly type = "assemble"

  public get assembling(): Hull | null {
    return this._assembling
  }

  private _assembling: Hull | null = null

  public constructor(
  ) {
    super()
  }

  public assemble(spec: LifeSpec): Result<void, string> {
    if (this.assembling != null) {
      return Result.Failed("already assembling")
    }

    const internalModules: InternalModule[] = spec.internalModuleSpecs.map(moduleSpec => {
      switch (moduleSpec.case) {
      case "assemble":
        return new Assemble()
      case "compute":
        return new Compute(moduleSpec.code)
      }
    })
    this._assembling = new Hull(internalModules, spec.hullSpec.energyAmount)
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