import { ComputerInterface } from "../module"
import type { SourceCode } from "../source_code"
import { AbstractModule } from "./abstract_module"

export class Computer extends AbstractModule<"computer"> implements ComputerInterface {
  public readonly case = "computer"

  public readonly code: SourceCode

  public constructor(
    public readonly codeBase: () => SourceCode
  ) {
    super()
    this.code = codeBase()
  }
}