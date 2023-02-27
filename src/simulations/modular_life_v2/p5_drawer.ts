import p5 from "p5"
import { World } from "./world"

export class P5Drawer {
  public constructor(
    private readonly p: p5,
    public readonly cellSize: number,
  ) {
  }

  public drawWorld(world: World): void {
    const p = this.p

    p.background(0x00)
    p.circle(100, 100, 100)
  }
}