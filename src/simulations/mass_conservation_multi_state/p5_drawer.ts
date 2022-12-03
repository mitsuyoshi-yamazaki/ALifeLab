import p5 from "p5"
import { Color } from "../../classes/color"
import { DistanceTransformResult } from "./distance_transform"
import { Drawer } from "./drawer"
import { CellSubstanceType, cellSubstanceTypes, World } from "./world"

const maximumDrawPressure = 1000

export class P5Drawer implements Drawer {
  private substanceColor: { [S in CellSubstanceType]: Color }

  public constructor(
    private readonly p: p5,
    public readonly cellSize: number,
  ) {
    this.substanceColor = {
      blue: new Color(0x00, 0x00, 0xFF),
      red: new Color(0x00, 0xFF, 0x00), // 赤いとキモいため
    }
  }

  public drawCanvas(): void {
    this.p.clear()
  }

  public drawWorld(world: World): void {
    this.p.background(0xFF, 0xFF)
    this.p.noStroke()

    world.cells.forEach((row, y) => {
      row.forEach((state, x) => {
        cellSubstanceTypes.forEach(substance => {
          const transparency = Math.min((state.substances[substance] / maximumDrawPressure) * 0x7F, 0xFF)
          const color = this.substanceColor[substance]
          this.p.fill(color.p5(this.p, transparency))
          this.p.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
        })
      })
    })
  }

  drawDistanceTransform(results: DistanceTransformResult[][]): void {
    this.p.background(0x22, 0x48)

    const strokeWeight = 2
    const cellRadius = this.cellSize / 2

    this.p.textAlign(this.p.CENTER, this.p.CENTER)

    results.forEach((row, y) => {
      row.forEach((result, x) => {
        const substance = result.dominantSubstance
        if (substance !== "none") {
          const color = (this.substanceColor[substance]).p5(this.p)
          this.p.noFill()
          this.p.strokeWeight(strokeWeight)
          this.p.stroke(color)
          this.p.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)

          this.p.fill(color)
        } else {
          this.p.fill(0xFF)
        }

        this.p.noStroke()
        this.p.text(`${result.distance}`, x * this.cellSize + cellRadius, y * this.cellSize + cellRadius)
      })
    })
  }
}