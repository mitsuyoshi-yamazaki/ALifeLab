import { Vector } from "../classes/physics"

export class Force {
  public constructor(public readonly magnitude: Vector) {
  }

  public static zero(): Force {
    return new Force(new Vector(0, 0))
  }

  public accelerationTo(mass: number): Vector {
    return this.magnitude.div(mass)
  }

  public consumedEnergyWith(mass: number): number {
    return this.magnitude.size * mass
  }

  public add(other: Force): Force {
    const vector = this.magnitude.add(other.magnitude)

    return new Force(vector)
  }
}
