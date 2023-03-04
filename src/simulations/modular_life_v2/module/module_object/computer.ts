import type { ComputerInterface } from "../module"
import type { SourceCode } from "../source_code"

export class Computer implements ComputerInterface {
  readonly case: "computer"
  readonly code: SourceCode

  public constructor(
  ) {
  }
}