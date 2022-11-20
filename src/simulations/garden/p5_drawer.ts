import p5 from "p5"
import { Color } from "../../classes/color"
import { AnyDrawableStates } from "./drawable_types"
import { LifeDrawableState } from "./life"
import { TerrainState } from "./terrain"
import { WorldDrawableState } from "./world"

type AnyDrawableStateCases = AnyDrawableStates["case"]
const drawPriority: { [K in AnyDrawableStateCases]: number } = {  // 数字の小さい方が先に描画
  world: 0,
  life: 20,
}

const drawEnergyMaxAmount = 1000
const energyColor = new Color(0xFF, 0xE6, 0x64)

export class P5Drawer {

  public constructor(
    private readonly p: p5,
    public readonly cellSize: number,
  ) {
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
    this.p.noStroke()

    state.terrains.forEach((row, y) => {
      row.forEach((terrain, x) => {
        this.drawTerrainAt(terrain, x, y)
      })
    })
  }

  private drawTerrainAt(terrain: TerrainState, x: number, y: number): void {
    const color = ((): p5.Color => {
      switch (terrain.case) {
      case "plain":
        return energyColor.p5(this.p, (terrain.energy / drawEnergyMaxAmount) * 0xFF )

      case "energy source":
        return energyColor.p5(this.p)
      }
    })()

    this.p.fill(color)
    this.p.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
  }

  private drawLife(state: LifeDrawableState): void {
  }
}