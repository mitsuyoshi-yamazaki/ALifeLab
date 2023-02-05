import p5 from "p5"
import { World } from "./world"

interface Drawer {
  drawCanvas(): void
  drawWorld(world: World, cellSize: number): void
}

export class P5Drawer implements Drawer {
  public constructor(
    private readonly p: p5,
    public readonly cellSize: number,
  ) {
  }

  public drawCanvas(): void {
    this.p.clear()
  }

  public drawWorld(world: World, cellSize: number): void {
    const p = this.p

    p.background(0xFF, 0xFF)
    p.noStroke()

    world.lives.forEach(life => {
      p.fill(0x20, 0xC0)
      p.ellipse(life.position.x * cellSize, life.position.y * cellSize, cellSize)
    })
  }
}