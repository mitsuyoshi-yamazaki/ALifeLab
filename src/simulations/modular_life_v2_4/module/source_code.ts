import type { ComputerApi } from "./api"

export type SourceCode = {
  // readonly hash: string  // TODO: 進化の検出用

  run(api: ComputerApi): void
}
