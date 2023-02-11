import type { AnyModule } from "./any_module"
import { createId } from "./module_id"
import { Module } from "./types"

export type InternalModule = Exclude<AnyModule, Hull>

export const isHull = (module: AnyModule): module is Hull => {
  return module.type === "hull"
}

// 最初はここに各機能を集約しておく
// Moduleに分割していく
export class Hull implements Module<"hull"> {
  public readonly id: number
  public readonly name = "Hull"
  public readonly type = "hull"

  public get energy(): number {
    return this.energy
  }

  private _energy = 0

  public constructor(
    public readonly internalModules: InternalModule[],
  ) {
    this.id = createId()
  }

  public addEnergy(amount: number): void {
    this._energy += amount
  }
}