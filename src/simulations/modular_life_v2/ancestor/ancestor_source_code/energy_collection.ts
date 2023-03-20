import { strictEntries } from "../../../../classes/utilities"
import { ComputerApi } from "../../module/api"
import { AnyModuleDefinition, HullDefinition, ModuleDefinition, ModuleId } from "../../module/module"
import { InternalModuleType } from "../../module/module_object/module_object"
import type { SourceCode } from "../../module/source_code"
import { clockwiseDirection, counterClockwiseDirection, NeighbourDirection } from "../../physics/direction"
import { getShortMaterialName, MaterialAmountMap } from "../../physics/material"
import { AncestorSpec } from "../spawner"

type LifeStateBorn = {
  readonly case: "born"
}
type LifeStateCollectEnergy = {
  readonly case: "collectEnergy"
  energyAmount: number
}
type LifeStateCollectResource = {
  readonly case: "collectResource"
  substanceAmount: number
}
type LifeStateReproduction = {
  readonly case: "reproduction"
}
type LifeStateConstructChild = {
  readonly case: "construct"
  readonly childHullId: ModuleId<"hull">
  readonly assemblingModules: AnyModuleDefinition[]
}
type LifeStatePregnant = {
  readonly case: "pregnant"
}
type LifeState = LifeStateBorn
  | LifeStateCollectResource
  | LifeStateCollectEnergy
  | LifeStateReproduction
  | LifeStateConstructChild
  | LifeStatePregnant

type StaticParameters = {
  readonly moveEnergyConsumption: number
  readonly assembleIngredients: MaterialAmountMap
  readonly lifeSpec: AncestorSpec
  readonly defaultWeight: number
  readonly hullId: ModuleId<"hull">
}

export class EnergyCollection implements SourceCode {
  private t = 0
  private state: LifeState = {
    case: "born",
  }

  private staticParameters = null as StaticParameters | null  // 計算量削減 & 変化しないので一度だけ取得した値を保管する

  public constructor(
    private direction: NeighbourDirection,
    private readonly retainRatio: number,
  ) {
  }

  public run(api: ComputerApi): void {
    if (this.staticParameters == null) {
      this.staticParameters = this.getStaticParameters(api)
    }

    api.status.getInternalModules("channel").forEach(channel => {
      api.action.uptake(channel.id)
    })

    if (this.t % 500 === 499) {
      this.direction = counterClockwiseDirection(this.direction)
    }

    const energyAmount = api.status.getEnergyAmount()
    if (energyAmount > 100) {
      const retainEnergy = Math.ceil(api.status.getRetainEnergyConsumption() * this.retainRatio)
      if (retainEnergy > 0 && energyAmount > retainEnergy) {
        api.action.retain(retainEnergy)
      }
    }

    switch (this.state.case) {
    case "born":
      if (this.t % 10 === 0) {
        if (energyAmount >= api.status.getMoveEnergyConsumption()) {
          api.action.move(this.direction)
          this.state = {
            case: "collectEnergy",
            energyAmount: energyAmount,
          }
        }
      }
      break
      
    case "collectEnergy": {
      if (this.t % 10 === 0) {
        if (energyAmount > 400) {
          this.state = {
            case: "collectResource",
            substanceAmount: api.status.getStoredAmount("substance"),
          }
        } else {
          if (energyAmount <= this.state.energyAmount) {
            api.action.move(this.direction)
          }

          this.state.energyAmount = energyAmount
        }
      }
      break
    }

    case "collectResource":
      if (this.t % 10 === 0) {
        if (energyAmount < 100) {
          this.state = {
            case: "collectEnergy",
            energyAmount: energyAmount,
          }
        } else {
          const substanceAmount = api.status.getStoredAmount("substance")
          if (substanceAmount <= this.state.substanceAmount && energyAmount >= api.status.getMoveEnergyConsumption()) {
            api.action.move(this.direction)
          }

          this.state.substanceAmount = substanceAmount

          if (this.hasEnoughResourceToReproduce(api, this.staticParameters.assembleIngredients) === true) {
            this.state = {
              case: "reproduction",
            }
          }
        }
      }
      break

    case "reproduction":
      if (this.t % 10 === 0) {
        const children = api.status.getNestedHull()
        if (children[0] != null) {
          this.state = {
            case: "construct",
            assemblingModules: [...this.staticParameters.lifeSpec.internalModules],
            childHullId: children[0].id,
          }

        } else {
          const assembler = api.status.getInternalModules("assembler")[0]
          if (assembler != null) {
            api.action.say("Assembling Hull")
            const hullDefinition: HullDefinition = {
              case: "hull",
              size: this.staticParameters.lifeSpec.hullSize,
            }
            api.action.assemble(assembler.id, this.staticParameters.hullId, hullDefinition)
          }
        }
      }
      break

    case "construct":
      if (this.t % 10 === 0) {
        const moduleDefinition = this.state.assemblingModules.shift()
        if (moduleDefinition != null) {
          const assembler = api.status.getInternalModules("assembler")[0]
          if (assembler != null) {
            api.action.say(`Assembling ${moduleDefinition.case}`)
            api.action.assemble(assembler.id, this.state.childHullId, moduleDefinition)
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

    api.action.say(`${this.retainRatio.toFixed(2)}E`)

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

    const hullDefinition = api.status.getHull()
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
      const modules = api.status.getInternalModules(moduleType)

      if (moduleType === "computer") {
        internalModuleDefinitions.push({
          case: "computer",
          codeBase: (() => new EnergyCollection(clockwiseDirection(this.direction), this.createNewRetainRatio(this.t))),  // TODO: thisがゾンビ化していないか確認する
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
        hullSize: hullDefinition.size,
        internalModules: internalModuleDefinitions,
      },
      defaultWeight: api.status.getWeight(),
      hullId: hullDefinition.id,
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

  private createNewRetainRatio(n: number): number {
    const newRetainRatio = (((Math.floor(n / 10) % 3) - 1) / 100)
    return Math.max(0, Math.min(1, this.retainRatio + newRetainRatio))
  }
}
