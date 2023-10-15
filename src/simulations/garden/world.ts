import { Vector } from "../../classes/physics"
import { Direction, HarvestResult, LifeApi, LookResult, MoveResult, SpawnResult } from "./api/api"
import { Cell } from "./cell"
import { Life } from "./objects/life"
import { LifeStatus } from "./life_code/life_code"

const energyDecayRate = 1


export class World {
  public get time(): number {
    return this._time
  }

  private _time = 0

  public constructor(
    public readonly cells: Cell[][],
  ) {
  }

  public calculate(): void {
    this.calculateLives()
    
    this._time += 1
  }

  private calculateLives(): void {
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.life == null) {
          return
        }
        cell.life.run()
      })
    })
  }

  private getLifeApiAt(position: Vector): LifeApi {
    // TODO: energy consumption
    return {
      time: () => this.time,
      lookAround: this.lookAroundAt(position),
      move(direction): MoveResult {
        return
      },

      spawn(direction): SpawnResult {
        throw `spawn() not implemented yet (at ${position})`
      },

      harvest(): HarvestResult {
        return
      },
    }
  }

  private lookAroundAt(position: Vector): () => LookResult {
    return () => {
      const x = position.x
      const y = position.y
      return {
        top: this.terrains[(y - 1 + this.size.y) % this.size.y][x],
        bottom: this.terrains[(y + 1) % this.size.y][x],
        left: this.terrains[y][(x - 1 + this.size.x) % this.size.x],
        right: this.terrains[y][(x + 1) % this.size.x],
      }
    }
  }
}