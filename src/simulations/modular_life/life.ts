import { Vector } from "../../classes/physics"
import * as Module from "./module"
import { LifeInterface } from "./primitive/world_object_interface"

export class Life implements LifeInterface {
  public readonly id: number
  public readonly case = "life"

  public constructor(
    public readonly hull: Module.Hull,
    public position: Vector,
  ) {
    this.id = hull.id
  }
}