import p5 from "p5"
import { World } from "./world"

interface Drawer {
  drawCanvas(): void
  drawWorld(world: World): void
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

  public drawWorld(world: World): void {
    this.p.background(0xFF, 0xFF)
    this.p.noStroke()
  }
}