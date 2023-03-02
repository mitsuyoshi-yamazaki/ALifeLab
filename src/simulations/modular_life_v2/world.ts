import { guardPositionArgument, Vector } from "../../classes/physics"
import { Direction, getDirectionVector, NeighbourDirection } from "./physics/direction"
import type { ComputerApi } from "./module/api"
import { Logger } from "./logger"
import { Terrain, TerrainCell } from "./terrain"
import { PhysicalConstant } from "./physics/physical_constant"
import { Engine, ScopeOperation } from "./engine"
import { Scope } from "./physics/scope"
import type { ComputeRequestMove, Life, MaterialTransferRequest, MaterialTransferRequestType } from "./api_request"
import type { AnyModule, Computer, ModuleType } from "./module/module"
import type { MaterialRecipeName, MaterialType, TransferrableMaterialType } from "./physics/material"
import { ValuedArrayMap } from "../../classes/utilities"
import { Environment } from "./physics/environment"

type LifeRequests = {
  moveRequest: ComputeRequestMove | null
  readonly materialTransferRequests: ValuedArrayMap<MaterialTransferRequestType, MaterialTransferRequest>
}

export class World {
  public get t(): number {
    return this._t
  }
  public get terrain(): Terrain {
    return this._terrain
  }
  
  private _t = 0
  private _terrain: Terrain
  private engine: Engine

  public constructor(
    public readonly size: Vector,
    public readonly logger: Logger,
    physicalConstant: PhysicalConstant,
  ) {
    this._terrain = new Terrain(size)
    this.engine = new Engine(physicalConstant)
  }

  public addAncestor(life: Life, atPosition: Vector): void {
    const cell = this.getTerrainCellAt(atPosition)
    cell.hull.push(life)
  }

  public setEnergyProductionAt(x: number, y: number, energyProduction: number): void {
    this.terrain.cells[y][x].energyProduction = energyProduction
  }

  public run(step: number): void {
    for (let i = 0; i < step; i += 1) {
      this.step()
    }
  }

  private step(): void {
    const environment: Environment = {
      time: this.t,
    }

    const calculateScope = (scope: Scope): { movedLifes: { life: Life, moveRequest: ComputeRequestMove }[] } => {
      const results: { movedLifes: { life: Life, moveRequest: ComputeRequestMove }[] } = {
        movedLifes: [],
      }
      const operations: ScopeOperation[] = []

      const lifeIndicesToRemove: number[] = []
      const livesToAdd: Life[] = []

      scope.hull.forEach((life, index) => {
        const computer = life.internalModules.computer[0] // 複数のComputerを実行できるようにはなっていない
        if (computer != null) {
          const requests = this.runLifeCode(computer, life, scope, environment)

          if (requests.moveRequest != null) {
            lifeIndicesToRemove.push(index)
            results.movedLifes.push({
              life,
              moveRequest: requests.moveRequest,
            })
          }
          
          operations.push({
            life,
            requests: requests.materialTransferRequests,
          })
        } else {
          operations.push({
            life,
            requests: new Map(),
          })
        }

        const childResults = calculateScope(life)
        livesToAdd.push(...childResults.movedLifes.map(x => x.life))
      })

      lifeIndicesToRemove.reverse()
      lifeIndicesToRemove.forEach(index => {
        scope.hull.splice(index, 1)
      })

      scope.hull.push(...livesToAdd)

      this.engine.celculateScope(scope, operations)

      return results
    }
    
    const movedLives: {life: Life, destinationPosition: Vector}[] = []

    this.terrain.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const result = calculateScope(cell)

        result.movedLifes.forEach(({ life, moveRequest }) => {
          const destinationPosition = this.getNewPosition(new Vector(x, y), moveRequest.direction)

          movedLives.push({
            life,
            destinationPosition,
          })
        })
      })
    })

    movedLives.forEach(({ life, destinationPosition }) => {
      const destinationCell = this.getTerrainCellAt(destinationPosition)
      destinationCell.hull.push(life)
    })

    this._t += 1
  }

  private getNewPosition(origin: Vector, direction: Direction): Vector {
    const directionVector = getDirectionVector(direction)
    return new Vector(
      (origin.x + directionVector.x + this.size.x) % this.size.x,
      (origin.y + directionVector.y + this.size.y) % this.size.y,
    )
  }

  private getTerrainCellAt(position: Vector): TerrainCell
  private getTerrainCellAt(x: number, y: number): TerrainCell
  private getTerrainCellAt(...args: [Vector] | [number, number]): TerrainCell {
    const { x, y } = ((): { x: number, y: number } => {
      if (guardPositionArgument(args)) {
        return args[0]
      }

      return {
        x: args[0],
        y: args[1],
      }
    })()

    return this.terrain.cells[y][x]
  }

  // ---- API ---- //
  private runLifeCode(computer: Computer, life: Life, scope: Scope, environment: Environment): LifeRequests {
    const lifeRequests: LifeRequests = {
      moveRequest: null,
      materialTransferRequests: new ValuedArrayMap<MaterialTransferRequestType, MaterialTransferRequest>(),
    }
    const api = this.createApiFor(life, scope, lifeRequests)
    computer.code([api, environment])

    return lifeRequests
  }

  private createApiFor(life: Life, scope: Scope, requests: LifeRequests): ComputerApi {
    const addMaterialTransferRequest = (request: MaterialTransferRequest): void => {
      requests.materialTransferRequests.getValueFor(request.case).push(request)
    }

    return {
      getStoredAmount(materialType: MaterialType): number {
        return life.amount[materialType]
      },
      getEnergyAmount(): number {
        return life.amount.energy
      },
      getHeat(): number {
        return life.heat
      },
      modules(): AnyModule[] {
        const internalModules = Array.from(Object.values(life.internalModules)).flatMap((x): AnyModule[] => x)

        return [
          life,
          ...internalModules,
        ]
      },
      move(direction: NeighbourDirection): void {
        requests.moveRequest = {
          case: "move",
          direction,
        }
      },
      uptake(materialType: TransferrableMaterialType, amount: number): void {
        addMaterialTransferRequest({
          case: "uptake",
          materialType,
          amount,
        })
      },
      excretion(materialType: TransferrableMaterialType, amount: number): void {
        addMaterialTransferRequest({
          case: "excretion",
          materialType,
          amount,
        })
      },
      synthesize(recipe: MaterialRecipeName): void {
        addMaterialTransferRequest({
          case: "synthesize",
          recipe,
        })
      },
      assemble(moduleType: ModuleType): void {
        addMaterialTransferRequest({
          case: "assemble",
          moduleType,
        })
      },
    }
  }
}
