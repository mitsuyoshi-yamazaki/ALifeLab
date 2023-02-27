import { ComputeArgument, SourceCode } from "../module/source_code"

/// ゲーム世界上で何も行わない
export const createStillCode = (): SourceCode => {
  return ([, environment]: ComputeArgument) => {
    if (environment.time % 100 === 0) {
      console.log(`[still code] t: ${environment.time}`)
    }
  }
}
