import { guardPositionArgument, Vector } from "../../classes/physics"
import { Direction, getDirectionVector, NeighbourDirection } from "./physics/direction"
import type { ComputerApi } from "./module/api"
import { Logger } from "./logger"
import { Terrain, TerrainCell } from "./terrain"
import { PhysicalConstant } from "./physics/physical_constant"
import { Engine } from "./engine"
import { createScopeUpdate, Scope, updateScope } from "./physics/scope"
import type { ComputeRequestMove, ComputeRequestUptake, GenericComputeRequest, Life, MaterialTransferRequestType } from "./api_request"
import type { AnyModuleInterface, ComputerInterface, ModuleType } from "./module/module"
import type { MaterialRecipeName, MaterialType, TransferrableMaterialType } from "./physics/material"
import type { Environment } from "./physics/environment"
import { AncestorSpec, Spawner } from "./ancestor/spawner"

type LifeRequests = {
  moveRequest: ComputeRequestMove | null
  readonly materialTransferRequests: { [RequestType in MaterialTransferRequestType]?: GenericComputeRequest<RequestType>[] }
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
  private spawner = new Spawner()

  public constructor(
    public readonly size: Vector,
    public readonly logger: Logger,
    physicalConstant: PhysicalConstant,
  ) {
    this._terrain = new Terrain(size)
    this.engine = new Engine(physicalConstant, logger)
  }

  public addAncestor(ancestorSpec: AncestorSpec, atPosition: Vector): void {
    const life = this.spawner.createLife(ancestorSpec)
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

    const allScopes: Scope[] = []

    const calculateScope = (scope: Scope): { movedLives: { life: Life, moveRequest: ComputeRequestMove }[] } => {
      allScopes.push(scope)

      const results: { movedLives: { life: Life, moveRequest: ComputeRequestMove }[] } = {
        movedLives: [],
      }
      // const operations: ScopeOperation[] = []  // TODO:

      const uptakeOperations: { life: Life, requests: ComputeRequestUptake[] }[] = []

      scope.hull.forEach(life => {
        const computer = life.internalModules.computer[0] // 複数のComputerを実行できるようにはなっていない
        if (computer != null) {
          const requests = this.runLifeCode(computer, life, scope, environment)

          if (requests.moveRequest != null) {
            scope.scopeUpdate.hullToRemove.push(life)
            results.movedLives.push({
              life,
              moveRequest: requests.moveRequest,
            })
          }
          
          const uptakeRequests = requests.materialTransferRequests["uptake"]
          if (uptakeRequests != null && uptakeRequests.length > 0) {
            uptakeOperations.push({
              life, 
              requests: uptakeRequests,
            })
          }
        }

        const childResults = calculateScope(life)
        scope.scopeUpdate.hullToAdd.push(...childResults.movedLives.map(x => x.life))
      })

      this.engine.temp_calculateUptakeOperations(scope, uptakeOperations)      

      return results
    }
    
    this.terrain.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const result = calculateScope(cell)

        result.movedLives.forEach(({ life, moveRequest }) => {
          const destinationPosition = this.getNewPosition(new Vector(x, y), moveRequest.direction)
          const destinationCell = this.getTerrainCellAt(destinationPosition)
          destinationCell.scopeUpdate.hullToAdd.push(life)
        })

        this.engine.calculateTerrainCell(cell, cell.scopeUpdate)
      })
    })

    allScopes.forEach(scope => {
      updateScope(scope, scope.scopeUpdate)
      scope.scopeUpdate = createScopeUpdate(scope)
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
  private runLifeCode(computer: ComputerInterface, life: Life, scope: Scope, environment: Environment): LifeRequests {
    const lifeRequests: LifeRequests = {
      moveRequest: null,
      materialTransferRequests: {},
    }
    const api = this.createApiFor(life, scope, lifeRequests)
    computer.code([api, environment])

    return lifeRequests
  }

  private createApiFor(life: Life, scope: Scope, lifeRequests: LifeRequests): ComputerApi {
    const addMaterialTransferRequest = <RequestType extends MaterialTransferRequestType>(request: GenericComputeRequest<RequestType>): void => {
      if (lifeRequests.materialTransferRequests[request.case] == null) {
        lifeRequests.materialTransferRequests[request.case] = []
      }
      (lifeRequests.materialTransferRequests[request.case] as GenericComputeRequest<RequestType>[]).push(request)
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
      modules(): AnyModuleInterface[] {
        const internalModules = Array.from(Object.values(life.internalModules)).flatMap((x): AnyModuleInterface[] => x)

        return [
          life,
          ...internalModules,
        ]
      },
      move(direction: NeighbourDirection): void {
        lifeRequests.moveRequest = {
          case: "move",
          direction,
        }
      },
      uptake(materialType: TransferrableMaterialType, numberOfChannels: number): void {
        addMaterialTransferRequest({
          case: "uptake",
          materialType,
          numberOfChannels,
        })
      },
      excretion(materialType: TransferrableMaterialType, numberOfChannels: number): void {
        addMaterialTransferRequest({
          case: "excretion",
          materialType,
          numberOfChannels,
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
