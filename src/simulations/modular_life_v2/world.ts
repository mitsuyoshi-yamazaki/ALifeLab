import { guardPositionArgument, Vector } from "../../classes/physics"
import { Direction, getDirectionVector, NeighbourDirection } from "./physics/direction"
import type { ComputerApi } from "./module/api"
import { Logger } from "./logger"
import { Terrain, TerrainCell } from "./terrain"
import { PhysicalConstant } from "./physics/physical_constant"
import { Engine, ScopeOperation } from "./engine"
import { createScopeUpdate, Scope, ScopeId, ScopeUpdate, updateScope } from "./physics/scope"
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
  private scopes = new Map<ScopeId, Scope>()

  public constructor(
    public readonly size: Vector,
    public readonly logger: Logger,
    physicalConstant: PhysicalConstant,
  ) {
    this._terrain = new Terrain(size)
    this.terrain.cells.forEach(row => {
      row.forEach(cell => {
        this.scopes.set(cell.scopeId, cell)
      })
    })
    this.engine = new Engine(physicalConstant)
  }

  public addAncestor(life: Life, atPosition: Vector): void {
    const cell = this.getTerrainCellAt(atPosition)
    cell.hull.push(life)
    this.scopes.set(life.scopeId, life)
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

    const scopeUpdates: ScopeUpdate[] = []

    const calculateScope = (scope: Scope, scopeUpdate: () => ScopeUpdate): { movedLives: { life: Life, moveRequest: ComputeRequestMove }[] } => {
      const results: { movedLives: { life: Life, moveRequest: ComputeRequestMove }[] } = {
        movedLives: [],
      }
      const operations: ScopeOperation[] = []

      scope.hull.forEach(life => {
        const computer = life.internalModules.computer[0] // 複数のComputerを実行できるようにはなっていない
        if (computer != null) {
          const requests = this.runLifeCode(computer, life, scope, environment)

          if (requests.moveRequest != null) {
            scopeUpdate().hullToRemove.push(life)
            results.movedLives.push({
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

        let childUpdate: ScopeUpdate | null = null
        const getUpdate = (): ScopeUpdate => {
          if (childUpdate == null) {
            childUpdate = createScopeUpdate(life)
            scopeUpdates.push(childUpdate)
          }
          return childUpdate
        }

        const childResults = calculateScope(life, getUpdate)
        scopeUpdate().hullToAdd.push(...childResults.movedLives.map(x => x.life))
      })

      this.engine.celculateScope(scope, operations)

      return results
    }
    
    this.terrain.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const scopeUpdate = createScopeUpdate(cell)
        scopeUpdates.push(scopeUpdate)

        const result = calculateScope(cell, () => scopeUpdate)

        result.movedLives.forEach(({ life, moveRequest }) => {
          const destinationPosition = this.getNewPosition(new Vector(x, y), moveRequest.direction)
          const destinationCell = this.getTerrainCellAt(destinationPosition)
          const update = createScopeUpdate(destinationCell)
          update.hullToAdd.push(life)
          scopeUpdates.push(update)
        })

        this.engine.calculateTerrainCell(cell, scopeUpdate)
      })
    })

    scopeUpdates.forEach(update => {
      const scope = this.scopes.get(update.scopeId)
      if (scope == null) {
        throw `Updated scope (${update.scopeId}) does not exist`
      }

      updateScope(scope, update)
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
