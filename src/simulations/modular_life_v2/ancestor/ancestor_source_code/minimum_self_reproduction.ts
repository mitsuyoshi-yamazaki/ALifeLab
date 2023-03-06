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

export class MinimumSelfReproductionCode implements SourceCode {
  private t = 0
  private state: LifeState = {
    case: "born",
  }

  private staticParameters = null as StaticParameters | null  // 計算量削減 & 変化しないので一度だけ取得した値を保管する
  
  public constructor(
    private readonly direction: NeighbourDirection,
  ) {
  }

  public run(api: ComputerApi): void {
    if (this.staticParameters == null) {
      this.staticParameters = this.getStaticParameters(api)
    }

    api.status.getModules("channel").forEach(channel => {
      api.action.uptake(channel.id)
    })

    switch (this.state.case) {
    case "born":
      if (this.t % 10 === 0) {
        if (api.status.getEnergyAmount() >= api.status.getMoveEnergyConsumption()) {
          api.action.move(this.direction)
          this.state = {
            case: "collectResource",
            substanceAmount: api.status.getStoredAmount("substance"),
          }
        }
      }
      break

    case "collectResource":
      if (this.t % 10 === 0) {
        const substanceAmount = api.status.getStoredAmount("substance")
        if (substanceAmount <= this.state.substanceAmount && api.status.getEnergyAmount() >= api.status.getMoveEnergyConsumption()) {
          api.action.move(this.direction)
        }

        this.state.substanceAmount = substanceAmount

        if (this.hasEnoughResourceToReproduce(api, this.staticParameters.assembleIngredients) === true) {
          const hullDefinition: HullDefinition = {
            case: "hull",
            size: this.staticParameters.lifeSpec.hullSize,
          }

          this.state = {
            case: "reproduction",
            assemblingModules: [
              hullDefinition,
              ...this.staticParameters.lifeSpec.internalModules,
            ],
          }
        }
      }
      break

    case "reproduction":
      if (this.t % 10 === 0) {
        const moduleDefinition = this.state.assemblingModules.shift()
        if (moduleDefinition != null) {
          const assembler = api.status.getModules("assembler")[0]
          if (assembler != null) {
            api.action.say(`Assembling ${moduleDefinition.case}`)
            api.action.assemble(assembler.id, moduleDefinition)
          }
        } else {
          api.action.say("pregnant")
          this.state = {
            case: "pregnant",
          }
        }
      }
      break

    case "pregnant":
      if (this.t % 10 === 0) {
        if (api.status.getWeight() <= this.staticParameters.defaultWeight) {
          this.state = {
            case: "collectResource",
            substanceAmount: api.status.getStoredAmount("substance"),
          }
        }
      }
      break

    default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = this.state
      throw `unexpected state ${(this.state as LifeState).case}`
    }
    }

    this.t += 1
  }

  private getStaticParameters(api: ComputerApi): StaticParameters {
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
          codeBase: (() => new MinimumSelfReproductionCode(clockwiseDirection(this.direction))),
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

  private hasEnoughResourceToReproduce(api: ComputerApi, assembleIngredients: MaterialAmountMap): boolean {
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
}
