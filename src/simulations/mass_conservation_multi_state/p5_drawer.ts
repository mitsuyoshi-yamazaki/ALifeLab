import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Drawer } from "./drawer"
import { CellSubstanceType, cellSubstanceTypes, World } from "./world"

const maximumDrawPressure = 1000

export class P5Drawer implements Drawer {
  private substanceColor: { [S in CellSubstanceType]: p5.Color }

  public constructor(
    private readonly p: p5,
    private readonly cellSize: number,
  ) {
    this.substanceColor = {
      blue: p.color(0x00, 0x00, 0xFF),
      red: p.color(0x00, 0xFF, 0x00), // 赤いとキモいため
    }
  }

  public drawWorld(world: World): void {
    this.p.background(0xFF, 0xFF)
    this.p.noStroke()

    world.cells.forEach((row, y) => {
      row.forEach((state, x) => {
        cellSubstanceTypes.forEach(substance => {
          const transparency = Math.min((state.substances[substance] / maximumDrawPressure) * 0x7F, 0xFF)
          const color = this.substanceColor[substance]
          color.setAlpha(transparency)
          this.p.fill(color)
          this.p.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
        })
      })
    })
  }

  public drawDistanceTransform(result: any, worldSize: Vector, cellSize: number): void {
    // TODO:
  }
}