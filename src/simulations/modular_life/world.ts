import { Result } from "../../classes/result"
import { Vector } from "../../classes/physics"
import { Module } from "./module/module"
import { WorldDelegate } from "./world_delegate"
import { Direction, getDirectionVector } from "./direction"
import { AnyModule, isCompute } from "./module"
import { EnergySource } from "./energy_source"

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

  public move(hull: Module.Hull, direction: Direction): Result<void, string> {
    const life = this.lives.find(l => l.hull.id === hull.id)
    if (life == null) {
      return Result.Failed(`no life with hull ${hull.id}`)
    }

    life.position = this.getNewPosition(life.position, direction)
    return Result.Succeeded(undefined)
  }

  public run(step: number): void {
    for (let i = 0; i < step; i += 1) {
      this.step()
    }
  }

  private step(): void {
    this.lives.forEach(life => {
      const modules: AnyModule[] = [
        life.hull,
        ...life.hull.internalModules,
      ]

      life.hull.internalModules
        .filter(isCompute)
        .forEach(computer => {
          computer.run(modules, {time: this._t})
        })
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
}