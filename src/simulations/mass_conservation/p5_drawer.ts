import p5 from "p5"
import { CellDrawableState } from "./cell"
import { AnyDrawableStates } from "./drawable_types"
import { WorldDrawableState } from "./world"

type AnyDrawableStateCases = AnyDrawableStates["case"]
const drawPriority: { [K in AnyDrawableStateCases]: number } = {  // 数字の小さい方が先に描画
  world: 0,
  cell: 10,
}

export class P5Drawer {
  public constructor(
    private readonly p: p5,
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
    case "cell":
      this.drawCell(state)
      return
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = state
      return
    }
    }
  }

  private drawWorld(state: WorldDrawableState): void {
  }

  private drawCell(state: CellDrawableState): void {
  }
}