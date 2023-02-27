import { Result } from "../../../classes/result"
import { Vector } from "../../../classes/physics"
import { EnergyWithdrawable } from "../primitive/energy_transaction"
import { EnergySourceInterface } from "../primitive/world_object_interface"
import { createId } from "../primitive/world_object_id"

export const isSunlight = (obj: unknown): obj is Sunlight => {
  return obj instanceof Sunlight
}

export class Sunlight implements EnergyWithdrawable, EnergySourceInterface {
  public readonly id: number
  public readonly case = "energy_source"
  public energyAmount = 0

  public get capacity(): number {
    return this.production
  }

  public constructor(
    public readonly position: Vector,
    public readonly production: number,  // energy production per each tick
  ) {
    this.id = createId()
  }

  public withdrawEnergy(amount: number): Result<void, string> {
    if (this.energyAmount < amount) {
      return Result.Failed(`${this} lack of energy (${this.energyAmount} < ${amount})`)
    }

    this.energyAmount -= amount
    return Result.Succeeded(undefined)
  }

  public toString(): string {
    return `${this.constructor.name} at ${this.position}`
  }
}