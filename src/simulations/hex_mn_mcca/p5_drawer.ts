import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Model } from "./model"

export interface Drawer {
  readonly fieldWidth: number
  readonly cellSize: number
  readonly canvasSize: Vector

  drawCanvas(): void
  drawModel(model: Model): void
}

export class P5Drawer implements Drawer {
  public readonly canvasSize: Vector

  public constructor(
    private readonly p: p5,
    public readonly fieldWidth: number,
    public readonly cellSize: number,
  ) {
    this.canvasSize = new Vector(fieldWidth, Math.sin(Math.PI / 3) * fieldWidth)
  }

  public drawCanvas(): void {
    this.p.clear()
  }

  drawModel(model: Model): void {
    const p = this.p
    const distanceX = this.cellSize
    const distanceY = Math.sin(Math.PI / 3) * this.cellSize
    const marginX = distanceX / 2
    const marginY = distanceY / 2

    p.background(0xFF)
    p.noStroke()
    p.fill(0x20, 0xFF)

    model.states.forEach((row, y) => {
      row.forEach((state, x) => {
        if (state <= 0) {
          return
        }

        const diameter = this.cellSize * state
        const xPosition = marginX + y * marginX + x * distanceX
        const xPositionInCanvas = (xPosition > this.fieldWidth) ? xPosition - this.fieldWidth : xPosition
        p.circle(xPositionInCanvas, marginY + y * distanceY, diameter)
      })
    })
  }
}