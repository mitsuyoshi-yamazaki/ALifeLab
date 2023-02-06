import { Vector } from "../../classes/physics"

export class EnergySource {
  public constructor(
    readonly position: Vector,
    readonly production: number,  // energy per each tick
  ) {
  }
}