import p5 from "p5"
import { AnyDrawableStates } from "./drawable_types"
import { LifeDrawableState } from "./life"
import { TerrainDrawableState } from "./terrain"
import { WorldDrawableState } from "./world"

type AnyDrawableStateCases = AnyDrawableStates["case"]
const drawPriority: { [K in AnyDrawableStateCases]: number } = {  // 数字の小さい方が先に描画
  world: 0,
  terrain: 10,
  life: 20,
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
    case "terrain":
      this.drawTerrain(state)
      return
    case "life":
      this.drawLife(state)
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

  private drawTerrain(state: TerrainDrawableState): void {
  }

  private drawLife(state: LifeDrawableState): void {
  }
}