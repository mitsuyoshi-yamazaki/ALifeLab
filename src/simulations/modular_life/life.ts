import { Vector } from "../../classes/physics"
import * as Module from "./module"
import { StringConvertible } from "./primitive/utility"
import { LifeInterface } from "./primitive/world_object_interface"

export class Life implements LifeInterface, StringConvertible {
  public readonly id: number
  public readonly case = "life"

  public constructor(
    public readonly hull: Module.Hull,
    public position: Vector,
  ) {
    this.id = hull.id
  }

  public toString(): string {
    return `Life[${this.id}] at ${this.position}`
  }
}