import { ComputerApi } from "../module/api"
import type { SourceCode } from "../module/source_code"
import { NeighbourDirection } from "../physics/direction"
import { minimumSelfReproduction } from "./ancestor_source_code/minimum_self_reproduction"

export const AncestorCode = {
  /// ゲーム世界上で何も行わない
  stillCode(): SourceCode {
    let t = 0
    return (api: ComputerApi) => {
      api.action.say(`t: ${t}`)
      t += 1
    }
  },

  /// 一定方向へ移動するのみ
  moveCode(direction: NeighbourDirection, moveInterval: number): SourceCode {
    let t = 0
    return (api: ComputerApi) => {
      api.action.say(`t: ${t}`)

      api.status.getModules("channel").forEach(channel => {
        api.action.uptake(channel.id)
      })

      if (t % moveInterval === 0) {
        api.action.move(direction)
      }

      t += 1
    }
  },

  /// 自己複製を行う
  minimumSelfReproduction: minimumSelfReproduction,
}
