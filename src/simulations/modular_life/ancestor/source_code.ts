import { clockwiseDirection, NeighbourDirection } from "../primitive/direction"
import { isEnergySource } from "../world_object/energy_source"
import { logFailure } from "../primitive/result"
import { WorldObject } from "../primitive/world_object_interface"
import { ComputeArgument, SourceCode } from "../module/source_code"
import { LifeSpec } from "../module/module_spec"

/// ゲーム世界上で何も行わない
export const createStillCode = (): SourceCode => {
  return () => {
    console.log("still code")
  }
}

/// 指定の方向に移動し続け、EnergySourceに行き当たったらエネルギーを回収する
export const createMoveCode = (direction: NeighbourDirection): SourceCode => {
  return ([api, environment]: ComputeArgument) => {
    if (environment.time % 10 === 0) {
      logFailure(api.move(direction))

      const nearbyObjects: WorldObject[] = Array.from(Object.values(api.lookAround())).flatMap(x => x)
      const energySource = nearbyObjects.find(isEnergySource)
      if (energySource != null) {
        logFailure(api.harvest(energySource))
      }
    }

    switch (environment.time % 150) {
    case 0: {
      const spec: LifeSpec = {
        hullSpec: {
          case: "hull",
        },
        internalModuleSpecs: [
          {
            case: "compute",
            code: createMoveCode(clockwiseDirection(direction)),
          },
          {
            case: "assemble",
          }
        ]
      }
      logFailure(api.assemble(spec))
      break
    }
    case 1:
      logFailure(api.release())
      break
    default:
      break
    }
  }
}