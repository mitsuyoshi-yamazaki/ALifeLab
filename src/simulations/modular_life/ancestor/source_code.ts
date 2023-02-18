import { clockwiseDirection, NeighbourDirection } from "../primitive/direction"
import { logFailure } from "../primitive/result"
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
      logFailure(api.harvest())
    }

    switch (environment.time % 150) {
    case 0: {
      const spec: LifeSpec = {
        hullSpec: {
          case: "hull",
          energyAmount: 200,
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

/// エネルギー消費（=移動）を最小に抑え繁殖する
export const createFloraCode = (direction: NeighbourDirection): SourceCode => {
  return ([api]: ComputeArgument) => {
    const harvestResult = api.harvest()
    const noEnergyGain = ((): boolean => {
      switch (harvestResult.resultType) {
      case "succeeded":
        return harvestResult.value <= 0
      case "failed":
        return true
      }
    })()

    if (noEnergyGain === true) {
      if (api.energyAmount > 11) {
        logFailure(api.move(direction))
        return
      }
    }

    if (api.isAssembling() === true) {
      if (api.energyAmount >= 20) {
        logFailure(api.move(direction))
        logFailure(api.release())
        return
      }
      return
    }

    if (api.energyAmount > 600) {
      const spec: LifeSpec = {
        hullSpec: {
          case: "hull",
          energyAmount: 200,
        },
        internalModuleSpecs: [
          {
            case: "compute",
            code: createFloraCode(clockwiseDirection(direction)),
          },
          {
            case: "assemble",
          }
        ]
      }
      logFailure(api.assemble(spec))
    }
  }
}
