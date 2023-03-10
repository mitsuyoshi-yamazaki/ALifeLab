import { guardPositionArgument, Vector } from "../../classes/physics"
import { Direction, getDirectionVector, NeighbourDirection, NeighbourDirections } from "./physics/direction"
import type { ComputerApi } from "./module/api"
import { Logger } from "./logger"
import { Terrain, TerrainCell } from "./terrain"
import { PhysicalConstant } from "./physics/physical_constant"
import { Engine, ScopeOperation } from "./engine"
import { createScopeUpdate, Scope, updateScope } from "./physics/scope"
import type { ComputeRequestMove, GenericComputeRequest, Life, MaterialTransferRequest, MaterialTransferRequestType } from "./api_request"
import type { AnyModuleDefinition, HullInterface, ModuleId, ModuleInterface, ModuleType } from "./module/module"
import type { MaterialAmountMap, MaterialType } from "./physics/material"
import { AncestorSpec, Spawner } from "./ancestor/spawner"
import { InternalModuleType } from "./module/module_object/module_object"
import { Computer } from "./module/module_object/computer"
import { isHull } from "./module/module_object/hull"

type LifeRequestCache = {
  moveRequest: ComputeRequestMove | null
  readonly materialTransferRequests: { [Id: string]: MaterialTransferRequest }
}
type LifeRequests = {
  moveRequest: ComputeRequestMove | null
  readonly materialTransferRequests: { [RequestType in MaterialTransferRequestType]: GenericComputeRequest<RequestType>[] }
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

  public addMaterial(materialType: MaterialType, amount: number, x: number, y: number): void {
    this.terrain.cells[y][x].amount[materialType] += amount
  }

  public initialize(): void {
    this.terrain.cells.forEach(row => {
      row.forEach(cell => {
        cell.heat = 1
        cell.scopeUpdate = createScopeUpdate(cell)
      })
    })
  }

  public run(step: number): void {
    for (let i = 0; i < step; i += 1) {
      this.step()
    }
  }

  private step(): void {
    const allScopes: Scope[] = []

    const calculateScope = (scope: Scope): { movedLives: { life: Life, moveRequest: ComputeRequestMove }[] } => {
      allScopes.push(scope)

      const results: { movedLives: { life: Life, moveRequest: ComputeRequestMove }[] } = {
        movedLives: [],
      }
      const operations: ScopeOperation[] = []

      scope.hull.forEach(life => {
        const computer = Object.values(life.internalModules.computer)[0] // 複数のComputerを実行できるようにはなっていない
        if (computer != null) {
          const requests = this.runLifeCode(computer, life, scope)

          if (requests.moveRequest != null) {
            if (this.engine.move(life, scope).resultType === "succeeded") {
              scope.scopeUpdate.hullToRemove.add(life)
              results.movedLives.push({
                life,
                moveRequest: requests.moveRequest,
              }) 
            }
          }

          operations.push({
            life,
            requests: requests.materialTransferRequests,
          })
        }

        const childResults = calculateScope(life)
        childResults.movedLives.map(childResult => scope.scopeUpdate.hullToAdd.add(childResult.life))

        this.engine.calculateHeatDamage(life, scope)
      })

      this.engine.celculateScope(scope, operations)

      return results
    }
    
    this.terrain.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const result = calculateScope(cell)

        result.movedLives.forEach(({ life, moveRequest }) => {
          const destinationPosition = this.getNewPosition(new Vector(x, y), moveRequest.direction)
          const destinationCell = this.getTerrainCellAt(destinationPosition)
          destinationCell.scopeUpdate.hullToAdd.add(life)
        })

        this.engine.calculateTerrainCell(cell)
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
  private runLifeCode(computer: Computer, life: Life, scope: Scope): LifeRequests {
    const requestCache: LifeRequestCache = {
      moveRequest: null,
      materialTransferRequests: {},
    }
    const api = this.createApiFor(life, scope, requestCache)

    try {
      computer.code.run(api)
    } catch (error) {
      this.logger.error(`[${life.scopeId}] ${error}`)
    }

    const result: LifeRequests = {
      moveRequest: requestCache.moveRequest,
      materialTransferRequests: {
        uptake: [],
        excretion: [],
        assemble: [],
        synthesize: [],
      },
    }

    const addRequest = <RequestType extends MaterialTransferRequestType>(request: GenericComputeRequest<RequestType>): void => {
      (result.materialTransferRequests[request.case] as GenericComputeRequest<RequestType>[]).push(request)
    }

    Array.from(Object.values(requestCache.materialTransferRequests)).forEach(request => {
      addRequest(request)
    })

    return result
  }

  private createApiFor(life: Life, scope: Scope, requestCache: LifeRequestCache): ComputerApi {
    const addMaterialTransferRequest = (request: MaterialTransferRequest): void => {
      requestCache.materialTransferRequests[request.module.id] = request
    }

    return {
      physics: {
        getAssembleIngredientsFor: (moduleDefinition: AnyModuleDefinition): MaterialAmountMap => {
          return this.engine.getAssembleIngredientsFor(moduleDefinition)
        },
      },
      environment: {
        movableDirections(): NeighbourDirection[] {
          if (isHull(scope)) {
            return []
          }
          return Array.from(Object.values(NeighbourDirections))
        },
        getHeat(): number {
          return scope.heat
        },
        getWeight(): number {
          return scope.hull.reduce((result, current) => result + current.getWeight(), 0)
        },
      },
      status: {
        getStoredAmount(materialType: MaterialType): number {
          return life.amount[materialType]
        },
        getEnergyAmount(): number {
          return life.amount.energy
        },
        getHeat(): number {
          return life.heat
        },
        getModules<M extends ModuleType>(moduleType: M): ModuleInterface<M>[] {
          if (moduleType === "hull") {
            return [life as HullInterface as ModuleInterface<M>]
          }

          const internalModuleType: InternalModuleType = moduleType
          return Array.from(Object.values(life.internalModules[internalModuleType]))
        },
        getWeight(): number {
          return life.getWeight()
        },
        getMoveEnergyConsumption: (): number => {
          return this.engine.calculateMoveEnergyConsumption(life)
        },
      },
      action: {
        say(message: string): void {
          life.saying = message
        },
        move(direction: NeighbourDirection): void {
          if (Object.keys(life.internalModules.mover).length <= 0) {
            throw "no Mover module"
          }
          requestCache.moveRequest = {
            case: "move",
            direction,
          }
        },
        uptake(moduleId: ModuleId<"channel">): void {
          const module = life.internalModules.channel[moduleId]
          if (module == null) {
            throw `no module with ID ${moduleId}`
          }
          addMaterialTransferRequest({
            case: "uptake",
            module,
          })
        },
        excretion(moduleId: ModuleId<"channel">): void {
          const module = life.internalModules.channel[moduleId]
          if (module == null) {
            throw `no module with ID ${moduleId}`
          }
          addMaterialTransferRequest({
            case: "excretion",
            module,
          })
        },
        synthesize(moduleId: ModuleId<"materialSynthesizer">): void {
          const module = life.internalModules.materialSynthesizer[moduleId]
          if (module == null) {
            throw `no module with ID ${moduleId}`
          }
          addMaterialTransferRequest({
            case: "synthesize",
            module,
          })
        },
        assemble(moduleId: ModuleId<"assembler">, moduleDefinition: AnyModuleDefinition): void {
          const module = life.internalModules.assembler[moduleId]
          if (module == null) {
            throw `no module with ID ${moduleId}`
          }
          addMaterialTransferRequest({
            case: "assemble",
            module,
            moduleDefinition,
          })
        },
      }
    }
  }
}
