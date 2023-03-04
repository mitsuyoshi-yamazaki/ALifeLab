import type { ComputeArgument, SourceCode } from "../module/source_code"
import type { NeighbourDirection } from "../physics/direction"

export const AncestorCode = {
  /// ゲーム世界上で何も行わない
  stillCode(): SourceCode {
    return ([, environment]: ComputeArgument) => {
      if (environment.time % 100 === 0) {
        console.log(`[still code] t: ${environment.time}`)
      }
    }
  },

  /// 一定方向へ移動するのみ
  moveCode(direction: NeighbourDirection, moveInterval: number): SourceCode {
    return ([api, environment]: ComputeArgument) => {
      api.getModules("channel").forEach(channel => {
        api.uptake("energy", channel.id)
      })

      if (environment.time % moveInterval === 0) {
        api.move(direction)
      }
    }
  }
}
