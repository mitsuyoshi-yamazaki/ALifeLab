import { Result } from "../../classes/result"
import { guardPositionArgument, Vector } from "../../classes/physics"
import { Direction, getDirectionVector } from "./primitive/direction"
import type { Environment } from "./primitive/environment"
import type { ComputerApi } from "./module/api"
import * as Module from "./module"
import { isAssemble } from "./module"
import { Logger } from "./logger"
import { Life } from "./life"
import { ComputeArgument } from "./module/source_code"
import { calculateAssembleEnergyConsumption, describeLifeSpec, LifeSpec } from "./module/module_spec"
import { Terrain, TerrainCell } from "./terrain"
import { PhysicsRule } from "./physics"

export class World {
  public get t(): number {
    return this._t
  }
  public get terrain(): Terrain {
    return this._terrain
  }
  public get lives(): Life[] {
    return this._lives
  }
  public energyProduction = 3
  
  private _t = 0
  private nextLives: Life[] = []
  private _lives: Life[] = []
  private _terrain: Terrain

  public constructor(
    public readonly size: Vector,
    public readonly logger: Logger,
    public readonly physicsRule: PhysicsRule,
  ) {
    this._terrain = new Terrain(size)
  }

  public addLife(hull: Module.Hull, atPosition: Vector): Result<void, string> {
    this.nextLives.push(new Life(hull, atPosition))

    return Result.Succeeded(undefined)
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

    this.lives.forEach(life => {
      const modules: Module.AnyModule[] = [
        life.hull,
        ...life.hull.internalModules,
      ]

      const computerArguments: ComputeArgument = [
        this.createApiFor(life, modules),
        environment,
      ]

      life.hull.internalModules
        .filter(Module.isCompute)
        .forEach(computer => {
          computer.run(computerArguments)
        })
    })

    const { heatLoss, energyHeatConversion, heatDamageRatio } = this.physicsRule
    const baseEnergyConsumption = 1

    this.lives.forEach(life => {
      const cell = this.getTerrainCellAt(life.position)
      const heatDamage = Math.floor(cell.heat * heatDamageRatio)
      life.hull.hits -= heatDamage  // TODO: 他のModuleへの影響を入れる

      if (life.hull.energyAmount <= 0 || life.hull.hits <= 0) {
        const energyAmount = 300  // FixMe: 仮で置いた値：算出する
        cell.energy += energyAmount
        return
      }

      life.hull.withdrawEnergy(baseEnergyConsumption)
      this.getTerrainCellAt(life.position).heat += baseEnergyConsumption
      this.nextLives.push(life)
    })

    this._lives = this.nextLives
    this.nextLives = []

    this.terrain.cells.forEach(row => {
      row.forEach(cell => {
        const energyLoss = Math.floor(cell.energy * energyHeatConversion)
        cell.energy = cell.energy - energyLoss + cell.energyProduction
        cell.heat += energyLoss
      })
    })

    this.terrain.cells.forEach(row => {
      row.forEach(cell => {
        cell.heat = Math.floor(cell.heat * (1 - heatLoss))
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

  private move(life: Life, direction: Direction): Result<void, string> {
    this.logActiveApiCall(life, `move ${direction}`)

    life.position = this.getNewPosition(life.position, direction)

    const requiredEnergy = 10
    life.hull.withdrawEnergy(requiredEnergy)  // TODO: Fail時の処理
    this.getTerrainCellAt(life.position).heat += requiredEnergy

    return Result.Succeeded(undefined)
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
  private createApiFor(life: Life, modules: Module.AnyModule[]): ComputerApi {
    return {
      energyAmount: life.hull.energyAmount,
      heat: 0,  // TODO:
      environmentalHeat: () => {
        return this.environmentalHeatAt(life.position)
      },
      connectedModules(): Module.ModuleType[] {
        return modules.map(module => module.type) // FixMe: 現在は全モジュールが接続している前提
      },
      isAssembling(): boolean {
        return modules.some(module => isAssemble(module) && module.assembling != null)
      },
      move: (direction: Direction) => {
        return this.move(life, direction)
      },
      harvest: () => {
        return this.harvest(life)
      },
      assemble: (spec: LifeSpec) => {
        return this.assemble(life, spec, modules)
      },
      release: () => {
        return this.release(life, modules)
      },
    }
  }

  private environmentalHeatAt(position: Vector): { [D in Direction]: number } {
    const { x, y } = position
    const top = (y - 1 + this.size.y) % this.size.y
    const bottom = (y + 1) % this.size.y
    const left = (x - 1 + this.size.x) % this.size.x
    const right = (x + 1) % this.size.x

    return {
      top: this.getTerrainCellAt(x, top).heat,
      bottom: this.getTerrainCellAt(x, bottom).heat,
      left: this.getTerrainCellAt(left, y).heat,
      right: this.getTerrainCellAt(right, y).heat,
      center: this.getTerrainCellAt(x, y).heat,
    }
  }

  private release(life: Life, modules: Module.AnyModule[]): Result<void, string> {
    this.logActiveApiCall(life, "release")
    
    const assemblers = modules.filter(isAssemble)
    assemblers.forEach(assembler => {
      const offspring = assembler.release()
      if (offspring == null) {
        return
      }

      this.addLife(offspring, life.position)
    })

    return Result.Succeeded(undefined)
  }

  private assemble(life: Life, spec: LifeSpec, modules: Module.AnyModule[]): Result<void, string> {
    this.logActiveApiCall(life, `assemble: ${describeLifeSpec(spec)}`)

    const assembleEnergyConsumption = 100
    const requiredEnergy = assembleEnergyConsumption + calculateAssembleEnergyConsumption(spec)
    if (life.hull.energyAmount < requiredEnergy) {
      return Result.Failed(`Lack of energy (required: ${requiredEnergy}, current: ${life.hull.energyAmount})`)
    }

    const assembler = modules.filter(isAssemble).find(assembler => assembler.assembling == null)
    if (assembler == null) {
      const descriptions = modules.filter(isAssemble).map(assembler => {
        return `- ${assembler.id}: assembling ${assembler.assembling?.id} (${(assembler.assembling?.internalModules ?? []).map(module => `${module.id} ${module.type}`).join(", ")})`
      })
      return Result.Failed(`No empty assembler:\n${descriptions.join("\n")}`)
    }

    life.hull.withdrawEnergy(requiredEnergy)  // TODO: Fail時の処理
    this.getTerrainCellAt(life.position).heat += assembleEnergyConsumption

    return assembler.assemble(spec)
  }

  private harvest(life: Life): Result<number, string> {
    this.logActiveApiCall(life, `harvest source at ${life.position}`)

    const cell = this.getTerrainCellAt(life.position)
    const harvestEnergy = Math.floor(cell.energy * this.physicsRule.harvestEnergyConversionRate)
    const energyLoss = cell.energy - harvestEnergy
    life.hull.transferEnergy(harvestEnergy) 
    cell.energy = 0
    cell.heat += energyLoss

    return Result.Succeeded(harvestEnergy)
  }

  /// 世界に対して働きかけるAPI呼び出しのログ出力
  private logActiveApiCall(life: Life, message: string): void {
    this.logger.debug(`Life[${life.hull.id}] at ${life.position} ${message}`)
  }
}
