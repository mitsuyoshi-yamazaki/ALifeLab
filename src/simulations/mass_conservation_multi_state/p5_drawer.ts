import p5 from "p5"
import { AnyDrawableStates } from "./drawable_types"
import { CellSubstanceType, cellSubstanceTypes, WorldDrawableState } from "./world"

const maximumDrawPressure = 1000

type AnyDrawableStateCases = AnyDrawableStates["case"]
const drawPriority: { [K in AnyDrawableStateCases]: number } = {  // 数字の小さい方が先に描画
  world: 0,
  dummy: 0,
}

export class P5Drawer {
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

  public drawAll<DrawableState extends AnyDrawableStates>(states: DrawableState[]): void {
    this.p.background(0xFF, 0xFF);

    [...states]
      .sort((lhs, rhs) => drawPriority[lhs.case] - drawPriority[rhs.case])
      .forEach(state => this.draw(state))
  }

  private draw<DrawableState extends AnyDrawableStates>(state: DrawableState): void {
    switch (state.case) {
    case "world":
      this.drawWorld(state)
      return
      
    case "dummy": // dummyがないと type AnyDrawableStates = WorldDrawableState となることにより default 節に WorldDrawableState が入りうると認識される
      return
     
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = state
      return
    }
    }
  }

  private drawWorld(state: WorldDrawableState): void {
    this.p.noStroke()

    state.cellStates.forEach((row, y) => {
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
}