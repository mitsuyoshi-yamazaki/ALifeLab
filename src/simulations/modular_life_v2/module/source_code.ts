import type { ComputerApi } from "./api"

export type SourceCode = {
  run(api: ComputerApi): void
}
