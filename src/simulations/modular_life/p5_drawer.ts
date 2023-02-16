import p5 from "p5"
import { Vector } from "../../classes/physics"
import { World } from "./world"
import { isEnergySource } from "./world_object/energy_source"

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
    p.fill(0xFF, 0xE0)
    p.textAlign(p.RIGHT)
    p.textStyle(p.NORMAL)
    p.textSize(8)

    const margin = 20
    p.text(status, size.x - margin, margin)
  }

  public drawWorld(world: World, cellSize: number): void {
    const p = this.p
    const radius = cellSize * 0.5
    const tombSize = radius
    const tombRadius = tombSize * 0.5
    const energyColor = p.color(0xFF, 0xFF, 0x00, 0xC0)
    const sunlightColor = p.color(0xFF, 0xFF, 0x00, 0x40)
    const energyCornerRadius = 1

    world.energySources.forEach(energySource => {
      if (energySource.production <= 0) {
        p.noStroke()
        p.fill(energyColor)
        p.square(energySource.position.x * cellSize + tombRadius, energySource.position.y * cellSize + tombRadius, tombSize)
        return
      }

      if (isEnergySource(energySource)) {
        const x = (energySource.position.x * cellSize) + radius
        const y = (energySource.position.y * cellSize) + radius

        p.stroke(energyColor)
        p.strokeWeight(1)
        p.noFill()
        p.square(x - radius, y - radius, cellSize, energyCornerRadius)

        const energyAmountSize = cellSize * (energySource.energyAmount / energySource.capacity)
        const energyAmountRadius = energyAmountSize * 0.5

        p.noStroke()
        p.fill(energyColor)
        p.square(x - energyAmountRadius, y - energyAmountRadius, energyAmountSize, energyCornerRadius)
        return
      }

      // Sunlight
      p.noStroke()
      p.fill(sunlightColor)
      p.square(energySource.position.x * cellSize, energySource.position.y * cellSize, cellSize)
    })

    p.noStroke()
    world.lives.forEach(life => {
      p.fill(0xFF, 0xC0)
      p.circle(life.position.x * cellSize, life.position.y * cellSize, cellSize)
    })
  }
}