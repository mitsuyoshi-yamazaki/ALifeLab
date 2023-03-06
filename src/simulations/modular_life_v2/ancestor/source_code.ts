import { strictEntries } from "../../../classes/utilities"
import { ComputerApi } from "../module/api"
import { AnyModuleDefinition, HullDefinition, ModuleDefinition } from "../module/module"
import { InternalModuleType } from "../module/module_object/module_object"
import type { SourceCode } from "../module/source_code"
import { clockwiseDirection, NeighbourDirection } from "../physics/direction"
import { getShortMaterialName, MaterialAmountMap } from "../physics/material"
import { AncestorSpec } from "./spawner"

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
  selfReproduction(direction: NeighbourDirection): SourceCode {
    let t = 0
    let moved = false

    let staticParameters = null as {  // 計算量削減 & 変化しないので一度だけ取得した値を保管する
      readonly moveEnergyConsumption: number
      readonly assembleIngredients: MaterialAmountMap
      readonly lifeSpec: AncestorSpec
    } | null

    const assemblingModule: AnyModuleDefinition[] = []

    return (api: ComputerApi) => {
      if (staticParameters == null) {
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
              code: this.selfReproduction(clockwiseDirection(direction)),
            })
          } else {
            internalModuleDefinitions.push(...modules)
          }

          modules.forEach(moduleInterface => {
            addIngredients(moduleInterface)
          })
        })
        
        staticParameters = {
          moveEnergyConsumption: api.status.getMoveEnergyConsumption(),
          assembleIngredients,
          lifeSpec: {
            hullSize: api.status.getModules("hull")[0]?.size ?? 5,
            internalModules: internalModuleDefinitions,
          },
        }
      }

      api.status.getModules("channel").forEach(channel => {
        api.action.uptake(channel.id)
      })

      if (t % 10 === 0) {
        if (moved !== true) {
          if (api.status.getEnergyAmount() >= api.status.getMoveEnergyConsumption()) {
            api.action.move(direction)
            moved = true
          }
        }

        const moduleDefinitionToAssemble = ((): AnyModuleDefinition | null => {
          const moduleDefinition = assemblingModule.shift()
          if (moduleDefinition != null) {
            return moduleDefinition
          }

          const assembleIngredients = staticParameters.assembleIngredients

          const hasEnoughResourceToReproduce = ((): boolean => {
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
          })()

          if (hasEnoughResourceToReproduce !== true) {
            return null
          }

          assemblingModule.push(...staticParameters.lifeSpec.internalModules)
          const hullDefinition: HullDefinition = {
            case: "hull",
            size: staticParameters.lifeSpec.hullSize,
          }
          return hullDefinition
        })()

        if (moduleDefinitionToAssemble != null) {
          const assembler = api.status.getModules("assembler")[0]
          if (assembler != null) {
            api.action.say(`Assembling ${moduleDefinitionToAssemble.case}`)
            api.action.assemble(assembler.id, moduleDefinitionToAssemble)
          }
        } else {
          if (api.environment.getWeight() > api.status.getWeight()) {
            api.action.move(direction)
          }
        }
      }

      t += 1
    }
  },
}
