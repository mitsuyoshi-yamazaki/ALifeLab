import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Life } from "./life"
import { Terrain } from "./terrain"

export class P5Drawer {
  public constructor(
    private readonly p: p5,
    public readonly cellSize: number,

    /// Canvas上の別の場所に描画する際（異なるレイヤーを隣同士に描画するなど）の座標オフセット
    public readonly offset: Vector,
  ) {
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

  public drawEnergyAmount(terrain: Terrain): void {
    const p = this.p
    const cellSize = this.cellSize
    const offsetX = this.offset.x
    const offsetY = this.offset.y
    const energyMeanAmount = 10

    p.noStroke()
    p.fill(0x0)
    p.rect(offsetX, offsetY, terrain.size.x * cellSize, terrain.size.y * cellSize)
  
    terrain.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const alpha = Math.floor((cell.energy / energyMeanAmount) * 0x80)
        p.fill(0xFF, 0xFF, 0x00, alpha)
        p.square(offsetX + x * cellSize, offsetY + y * cellSize, cellSize)
      })
    })
  }

  public drawHeatMap(terrain: Terrain): void {
    const p = this.p
    const cellSize = this.cellSize
    const offsetX = this.offset.x
    const offsetY = this.offset.y
    const heatMeanAmount = 10

    p.noStroke()
    p.fill(0x0)
    p.rect(offsetX, offsetY, terrain.size.x * cellSize, terrain.size.y * cellSize)

    terrain.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const alpha = Math.floor((cell.heat / heatMeanAmount) * 0x80)
        p.fill(0xFF, 0x00, 0x00, alpha)
        p.square(offsetX + x * cellSize, offsetY + y * cellSize, cellSize)
      })
    })
  }

  public drawLives(lives: Life[]): void {
    const p = this.p
    const cellSize = this.cellSize

    p.noStroke()
    lives.forEach(life => {
      p.fill(0xFF, 0xC0)
      p.circle(this.offset.x + life.position.x * cellSize, this.offset.y + life.position.y * cellSize, cellSize)
    })
  }
}