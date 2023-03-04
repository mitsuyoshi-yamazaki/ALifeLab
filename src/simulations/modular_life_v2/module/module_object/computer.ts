import type { ComputerInterface } from "../module"
import type { SourceCode } from "../source_code"

export class Computer implements ComputerInterface {
  public readonly case: "computer"

  public constructor(
    public readonly code: SourceCode
  ) {
  }
}