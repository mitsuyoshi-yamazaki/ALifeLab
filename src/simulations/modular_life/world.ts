import { Vector } from "../../classes/physics"
import { Module } from "./module/module"

export type Life = Module.Hull

export class World {
  public readonly lives: Life[] = []
  
  public constructor(
    public readonly size: Vector,
  ) {
  }

  public addLife(life: Life): void {
    this.lives.push(life)
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