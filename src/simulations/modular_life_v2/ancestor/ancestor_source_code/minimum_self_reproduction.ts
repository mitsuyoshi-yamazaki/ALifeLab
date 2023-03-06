import { strictEntries } from "../../../../classes/utilities"
import { ComputerApi } from "../../module/api"
import { AnyModuleDefinition, HullDefinition, ModuleDefinition } from "../../module/module"
import { InternalModuleType } from "../../module/module_object/module_object"
import type { SourceCode } from "../../module/source_code"
import { clockwiseDirection, NeighbourDirection } from "../../physics/direction"
import { getShortMaterialName, MaterialAmountMap } from "../../physics/material"
import { AncestorSpec } from "../spawner"

type LifeStateBorn = {
  readonly case: "born"
}
type LifeStateCollectResource = {
  readonly case: "collectResource"
  substanceAmount: number
}
type LifeStateReproduction = {
  readonly case: "reproduction"
  readonly assemblingModules: AnyModuleDefinition[]
}
type LifeStatePregnant = {
  readonly case: "pregnant"
}
type LifeState = LifeStateBorn | LifeStateCollectResource | LifeStateReproduction | LifeStatePregnant

type StaticParameters = {
  readonly moveEnergyConsumption: number
  readonly assembleIngredients: MaterialAmountMap
  readonly lifeSpec: AncestorSpec
  readonly defaultWeight: number
}

export const minimumSelfReproduction = (direction: NeighbourDirection): SourceCode => {
  let t = 0
  let state: LifeState = {
    case: "born",
  }
  
  let staticParameters = null as StaticParameters | null  // 計算量削減 & 変化しないので一度だけ取得した値を保管する

  return (api: ComputerApi) => {
    if (staticParameters == null) {
      staticParameters = getStaticParameters(api, direction)
    }

    api.status.getModules("channel").forEach(channel => {
      api.action.uptake(channel.id)
    })

    switch (state.case) {
    case "born":
      if (t % 10 === 0) {
        if (api.status.getEnergyAmount() >= api.status.getMoveEnergyConsumption()) {
          api.action.move(direction)
          state = {
            case: "collectResource",
            substanceAmount: api.status.getStoredAmount("substance"),
          }
        }
      }
      break

    case "collectResource":
      if (t % 10 === 0) {
        const substanceAmount = api.status.getStoredAmount("substance")
        if (substanceAmount <= state.substanceAmount && api.status.getEnergyAmount() >= api.status.getMoveEnergyConsumption()) {
          api.action.move(direction)
        }

        state.substanceAmount = substanceAmount

        if (hasEnoughResourceToReproduce(api, staticParameters.assembleIngredients) === true) {
          const hullDefinition: HullDefinition = {
            case: "hull",
            size: staticParameters.lifeSpec.hullSize,
          }

          state = {
            case: "reproduction",
            assemblingModules: [
              hullDefinition,
              ...staticParameters.lifeSpec.internalModules,
            ],
          }
        }
      }
      break
    
    case "reproduction":
      if (t % 10 === 0) {
        const moduleDefinition = state.assemblingModules.shift()
        if (moduleDefinition != null) {
          const assembler = api.status.getModules("assembler")[0]
          if (assembler != null) {
            api.action.say(`Assembling ${moduleDefinition.case}`)
            api.action.assemble(assembler.id, moduleDefinition)
          }
        } else {
          state = {
            case: "pregnant",
          }
        }
      }
      break
      
    case "pregnant":
      if (t % 10 === 0) {
        if (api.status.getWeight() <= staticParameters.defaultWeight) {
          state = {
            case: "collectResource",
            substanceAmount: api.status.getStoredAmount("substance"),
          }
        }
      }
      break
      
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = state
      break
    }
    }

    t += 1
  }
}

const getStaticParameters = (api: ComputerApi, direction: NeighbourDirection): StaticParameters => {
  const assembleIngredients: MaterialAmountMap = {}
  const internalModuleTypesToAssemble: InternalModuleType[] = [
    "assembler",
    "channel",
    "mover",
    "computer",
  ]

  const hullDefinition = api.status.getModules("hull")[0]
  const internalModuleDefinitions: ModuleDefinition<InternalModuleType>[] = []

  const addIngredients = (moduleDefinition: AnyModuleDefinition): void => {
    const ingredients = api.physics.getAssembleIngredientsFor(moduleDefinition)
    strictEntries(ingredients).forEach(([material, amount]) => {
      assembleIngredients[material] = (assembleIngredients[material] ?? 0) + (amount ?? 0)
    })
  }

  if (hullDefinition != null) {
    addIngredients(hullDefinition)
  }

  internalModuleTypesToAssemble.forEach(moduleType => {
    const modules = api.status.getModules(moduleType)

    if (moduleType === "computer") {
      internalModuleDefinitions.push({
        case: "computer",
        code: minimumSelfReproduction(clockwiseDirection(direction)),
      })
    } else {
      internalModuleDefinitions.push(...modules)
    }

    modules.forEach(moduleInterface => {
      addIngredients(moduleInterface)
    })
  })

  return {
    moveEnergyConsumption: api.status.getMoveEnergyConsumption(),
    assembleIngredients,
    lifeSpec: {
      hullSize: api.status.getModules("hull")[0]?.size ?? 5,
      internalModules: internalModuleDefinitions,
    },
    defaultWeight: api.status.getWeight(),
  }
}

const hasEnoughResourceToReproduce = (api: ComputerApi, assembleIngredients: MaterialAmountMap): boolean => {
  for (const [material, amount] of strictEntries(assembleIngredients)) {
    if (amount == null) {
      continue
    }
    if (material === "energy") {
      const energyAmount = api.status.getEnergyAmount()
      if (energyAmount < amount) {
        api.action.say(`${getShortMaterialName(material)}${energyAmount}/${amount}`)
        return false
      }
      continue
    }

    const storedAmount = api.status.getStoredAmount(material)
    if (storedAmount < amount) {
      api.action.say(`${getShortMaterialName(material)}${storedAmount}/${amount}`)
      return false
    }
  }
  return true
}