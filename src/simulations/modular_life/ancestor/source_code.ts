import { NeighbourDirection } from "../direction"
import { isEnergySource } from "../energy_source"
import { logFailure } from "../result"
import type { ComputeArgument, SourceCode, WorldObject } from "../types"

/// ゲーム世界上で何も行わない
export const createStillCode = (): SourceCode => {
  return () => {
    console.log("still code")
  }
}

/// 指定の方向に移動し続け、EnergySourceに行き当たったらエネルギーを回収する
export const createMoveCode = (direction: NeighbourDirection): SourceCode => {
  return ([api, environment]: ComputeArgument) => {
    if (environment.time % 10 !== 0) {
      return
    }

    logFailure(api.move(direction))

    const nearbyObjects: WorldObject[] = Array.from(Object.values(api.lookAround())).flatMap(x => x)
    const energySource = nearbyObjects.find(isEnergySource)
    if (energySource != null) {
      logFailure(api.harvest(energySource))
    }
  }
}