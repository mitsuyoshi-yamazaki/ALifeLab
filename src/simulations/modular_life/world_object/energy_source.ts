import { Result } from "../../../classes/result"
import { Vector } from "../../../classes/physics"
import { EnergyWithdrawable } from "../primitive/energy_transaction"

export const isEnergySource = (obj: unknown): obj is EnergySource => {
  return obj instanceof EnergySource
}

export class EnergySource implements EnergyWithdrawable {
  public get energyAmount(): number {
    return this._energyAmount
  }

  private _energyAmount = 0

  public constructor(
    readonly position: Vector,
    readonly production: number,  // energy production per each tick
    readonly capacity: number,
  ) {
  }

  public withdrawEnergy(amount: number): Result<void, string> {
    if (this.energyAmount < amount) {
      return Result.Failed(`${this} lacks energy (${this.energyAmount} < ${amount})`)
    }

    this._energyAmount = Math.max(this.energyAmount - amount, 0)
    return Result.Succeeded(undefined)
  }

  public step(): void {
    this._energyAmount = Math.min(this.energyAmount + this.production, this.capacity)
  }

  public toString(): string {
    return `${this.constructor.name} at ${this.position}`    
  }
}