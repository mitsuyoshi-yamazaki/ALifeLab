import { Vector } from "../../classes/physics"
import { Module } from "./module/module"

type Life = Module.Hull

export class World {
  public readonly lives: Life[] = []
  
  public constructor(
    public readonly size: Vector,
  ) {
  }

  public addLife(life: Life): void {
    this.lives.push(life)
  }
}