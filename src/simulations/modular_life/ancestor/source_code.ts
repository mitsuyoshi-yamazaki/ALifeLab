import { Direction } from "../direction"
import { isEnergySource } from "../energy_source"
import { ComputeArgument } from "../module"
import * as Module from "../module"
import { logFailure } from "../result"
import { WorldObject } from "../types"

export const createStillCode = (): Module.SourceCode => {
  return () => {
    console.log("still code")
  }
}

export const createMoveCode = (direction: Direction): Module.SourceCode => {
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