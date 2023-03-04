import { MoverInterface } from "../module"
import { AbstractModule } from "./abstract_module"

export class Mover extends AbstractModule<"mover"> implements MoverInterface {
  readonly case: "mover"

  public constructor(
  ) {
    super()
  }
}