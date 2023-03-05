import { AssemblerInterface } from "../module"
import { AbstractModule } from "./abstract_module"

export class Assembler extends AbstractModule<"assembler"> implements AssemblerInterface {
  public readonly case = "assembler"

  public cooldown = 0

  public constructor(
  ) {
    super()
  }
}