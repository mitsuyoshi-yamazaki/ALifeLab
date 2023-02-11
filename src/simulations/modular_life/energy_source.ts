import { Vector } from "../../classes/physics"

export class EnergySource {
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

  public harvest(amount: number): void {
    this._energyAmount = Math.max(this.energyAmount - amount, 0)
  }

  public step(): void {
    this._energyAmount = Math.min(this.energyAmount + this.production, this.capacity)
  }
}