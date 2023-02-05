import { Result } from "../../classes/result"
import { Vector } from "../../classes/physics"
import { Module } from "./module/module"

export type Life = {
  position: Vector
  hull: Module.Hull
}

export class World {
  public readonly lives: Life[] = []
  
  public constructor(
    public readonly size: Vector,
  ) {
  }

  public addLife(hull: Module.Hull, atPosition: Vector): Result<void, string> {
    // TODO: 位置検証
    this.lives.push({
      position: atPosition,
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
    // TODO:
  }
}