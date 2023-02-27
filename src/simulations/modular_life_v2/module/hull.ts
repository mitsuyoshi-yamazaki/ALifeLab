import { Result } from "../../../classes/result"
import { EnergyTransferable, EnergyWithdrawable } from "../physics/energy_transaction"
import type { AnyModule } from "./any_module"
import { Module } from "./types"

export type InternalModule = Exclude<AnyModule, Hull>

export const isHull = (module: AnyModule): module is Hull => {
  return module.type === "hull"
}

// 最初はここに各機能を集約しておく
// Moduleに分割していく
export class Hull extends Module<"hull"> implements EnergyTransferable, EnergyWithdrawable {
  public readonly name = "Hull"
  public readonly type = "hull"

  public get energyAmount(): number {
    return this._energyAmount
  }

  public constructor(
    public readonly internalModules: InternalModule[],
    private _energyAmount: number,
    hits: number,
    hitsMax: number,
  ) {
    super(hits, hitsMax)
  }

  public transferEnergy(amount: number): Result<void, string> {
    this._energyAmount += amount
    return Result.Succeeded(undefined)
  }

  public withdrawEnergy(amount: number): Result<void, string> {
    if (this.energyAmount < amount) {
      return Result.Failed(`${this} lack of energy (${this.energyAmount} < ${amount})`)
    }

    this._energyAmount -= amount
    return Result.Succeeded(undefined)
  }
}