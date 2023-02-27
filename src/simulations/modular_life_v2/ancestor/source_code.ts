import { ComputeArgument, SourceCode } from "../module/source_code"

export const AncestorCode = {
  /// ゲーム世界上で何も行わない
  stillCode(): SourceCode {
    return ([, environment]: ComputeArgument) => {
      if (environment.time % 100 === 0) {
        console.log(`[still code] t: ${environment.time}`)
      }
    }
  },
}
