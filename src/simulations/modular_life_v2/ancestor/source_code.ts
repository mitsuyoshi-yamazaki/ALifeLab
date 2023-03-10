import { ComputerApi } from "../module/api"
import type { SourceCode } from "../module/source_code"
import { NeighbourDirection } from "../physics/direction"
import { EnergyCollection } from "./ancestor_source_code/energy_collection"
import { MinimumSelfReproductionCode } from "./ancestor_source_code/minimum_self_reproduction"

export const AncestorCode = {
  /// ゲーム世界上で何も行わない
  stillCode(): SourceCode { 
    return {
      t: 0,
      run(api: ComputerApi): void {
        api.action.say(`t: ${this.t}`)
        this.t += 1
      },
    } as { t: number, run(api: ComputerApi): void }
  },

  /// 一定方向へ移動するのみ
  moveCode(direction: NeighbourDirection, moveInterval: number): SourceCode {
    return {
      t: 0,
      run(api: ComputerApi): void {
        api.action.say(`t: ${this.t}`)

        api.status.getInternalModules("channel").forEach(channel => {
          api.action.uptake(channel.id)
        })

        if (this.t % moveInterval === 0) {
          api.action.move(direction)
        }

        this.t += 1
      },
    } as { t: number, run(api: ComputerApi): void }
  },

  /// 自己複製を行う
  minimumSelfReproduction(direction: NeighbourDirection): SourceCode {
    return new MinimumSelfReproductionCode(direction)
  },

  energyCollection(direction: NeighbourDirection): SourceCode {
    return new EnergyCollection(direction)
  },
}
