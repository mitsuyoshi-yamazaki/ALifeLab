import p5 from "p5"
import { AnyDrawableStates } from "./drawable_types"
import { WorldDrawableState } from "./world"

const maximumDrawPressure = 1000

type AnyDrawableStateCases = AnyDrawableStates["case"]
const drawPriority: { [K in AnyDrawableStateCases]: number } = {  // 数字の小さい方が先に描画
  world: 0,
  dummy: 0,
}

export class P5Drawer {
  public constructor(
    private readonly p: p5,
    private readonly cellSize: number,
  ) {
  }

  public drawAll<DrawableState extends AnyDrawableStates>(states: DrawableState[]): void {
    this.p.background(0, 0xFF);

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
        this.p.fill(Math.min((state.mass / maximumDrawPressure) * 0xFF, 0xFF))
        this.p.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
      })
    })
  }
}