import { Result } from "../../classes/result"
import { Vector } from "../../classes/physics"
import type { WorldDelegate } from "./world_delegate"
import { Direction, getDirectionVector } from "./direction"
import { EnergySource } from "./energy_source"
import type { Environment } from "./environment"
import type { ComputerApi, LookAroundResult } from "./api"
import * as Module from "./module"
import { WorldObject } from "./types"
import { energyTransaction } from "./energy_transaction"
import { isNearTo } from "./utility"

export type Life = {
  position: Vector
  readonly hull: Module.Hull
}

export class World implements WorldDelegate {
  public get t(): number {
    return this._t
  }
  public readonly energySources: EnergySource[] = []
  public readonly lives: Life[] = []
  
  private _t = 0

  public constructor(
    public readonly size: Vector,
  ) {
  }

  public addEnergySource(energySource: EnergySource): void {
    this.energySources.push(energySource)
  }

  public addLife(hull: Module.Hull): Result<void, string> {
    this.lives.push({
      position: this.size.div(2), // TODO:
      hull,
    })

    return Result.Succeeded(undefined)
  }

  public run(step: number): void {
    for (let i = 0; i < step; i += 1) {
      this.step()
    }
  }

  private step(): void {
    const objectCache: WorldObject[][][] = []
    for (let y = 0; y < this.size.y; y += 1) {
      const row: WorldObject[][] = []
      objectCache.push(row)
      for (let x = 0; x < this.size.x; x += 1) {
        row.push([])
      }
    }
    this.lives.forEach(life => {
      objectCache[life.position.y][life.position.x].push(life.hull)
    })
    this.energySources.forEach(energySource => {
      objectCache[energySource.position.y][energySource.position.x].push(energySource)
    })

    const environment: Environment = {
      time: this.t,
    }

    this.lives.forEach(life => {
      const modules: Module.AnyModule[] = [
        life.hull,
        ...life.hull.internalModules,
      ]

      const computerArguments = ((): Module.ComputeArgument => {
        const api: ComputerApi = {
          connectedModules(): Module.ModuleType[] {
            return modules.map(module => module.type) // FixMe: 現在は全モジュールが接続している前提
          },
          move: (direction: Direction) => {
            return this.move(life, direction)
          },
          lookAround: () => {
            return this.lookAround(life, objectCache)
          },
          harvest: (energySource: EnergySource) => {
            return this.harvest(life, energySource)
          },
        }
        return [api, environment]
      })()

      life.hull.internalModules
        .filter(Module.isCompute)
        .forEach(computer => {
          computer.run(computerArguments)
        })
    })

    this.energySources.forEach(energySource => energySource.step())

    this._t += 1
  }

  private getNewPosition(origin: Vector, direction: Direction): Vector {
    const directionVector = getDirectionVector(direction)
    return new Vector(
      (origin.x + directionVector.x + this.size.x) % this.size.x,
      (origin.y + directionVector.y + this.size.y) % this.size.y,
    )
  }

  private move(life: Life, direction: Direction): Result<void, string> {
    life.position = this.getNewPosition(life.position, direction)
    return Result.Succeeded(undefined)
  }

  private lookAround(life: Life, objectCache: WorldObject[][][]): LookAroundResult {
    const { x, y } = life.position
    const top = (y - 1 + this.size.y) % this.size.y
    const bottom = (y + 1) % this.size.y
    const left = (x - 1 + this.size.x) % this.size.x
    const right = (x + 1) % this.size.x

    return {
      top: objectCache[top][x],
      bottom: objectCache[bottom][x],
      left: objectCache[y][left],
      right: objectCache[y][right],
      center: objectCache[y][x],
    }
  }

  private harvest(life: Life, energySource: EnergySource): Result<number, string> {
    if (isNearTo(life.position, energySource.position) !== true) {
      return Result.Failed(`EnergySource at ${energySource.position} is not in range from ${life.position}`)
    }

    return energyTransaction(energySource, life.hull)    
  }
}
