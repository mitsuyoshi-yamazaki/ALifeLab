import { Module } from "./types"

export type SourceCode = () => void

export class Compute implements Module<"compute"> {
  readonly name = "Computer"
  readonly type = "compute"

  public constructor(
    public readonly code: SourceCode,
  ) {
  }
}