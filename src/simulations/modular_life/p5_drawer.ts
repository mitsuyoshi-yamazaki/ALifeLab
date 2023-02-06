import p5 from "p5"
import { Vector } from "../../classes/physics"
import { World } from "./world"

interface Drawer {
  drawCanvas(): void
  drawStatus(size: Vector, status: string): void
  drawWorld(world: World, cellSize: number): void
}

export class P5Drawer implements Drawer {
  public constructor(
    private readonly p: p5,
    public readonly cellSize: number,
  ) {
  }

  public drawCanvas(): void {
    const p = this.p

    p.clear()
    p.background(0x20, 0xFF)
  }

  public drawStatus(size: Vector, status: string): void {
    const p = this.p

    p.noStroke()
    p.fill(0x00, 0xE0)
    p.textAlign(p.RIGHT)
    p.textStyle(p.NORMAL)
    p.textSize(8)

    const margin = 20
    p.text(status, size.x - margin, margin)
  }

  public drawWorld(world: World, cellSize: number): void {
    const p = this.p

    p.noStroke()

    world.energySources.forEach(energySource => {
      p.fill(0xFF, 0xFF, 0x00, 0xC0)
      p.rect(energySource.position.x * cellSize, energySource.position.y * cellSize, cellSize, cellSize)
    })

    world.lives.forEach(life => {
      p.fill(0xFF, 0xC0)
      p.ellipse(life.position.x * cellSize, life.position.y * cellSize, cellSize)
    })
  }
}