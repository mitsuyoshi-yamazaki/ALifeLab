import { Result } from "../../../classes/result"
import { EnergyTransferable } from "../primitive/energy_transaction"
import type { AnyModule } from "./any_module"
import { Module } from "./types"

export type InternalModule = Exclude<AnyModule, Hull>

export const isHull = (module: AnyModule): module is Hull => {
  return module.type === "hull"
}

// 最初はここに各機能を集約しておく
// Moduleに分割していく
export class Hull extends Module<"hull"> implements EnergyTransferable {
  public readonly name = "Hull"
  public readonly type = "hull"

  public get energy(): number {
    return this._energy
  }

  private _energy = 0

  public constructor(
    public readonly internalModules: InternalModule[],
  ) {
    super()
  }

  public transferEnergy(amount: number): Result<void, string> {
    this._energy += amount
    return Result.Succeeded(undefined)
  }
}