import p5 from "p5"
import { Color } from "../../classes/color"
import { World } from "./world"

const energyColor = new Color(0xFF, 0xE6, 0x64)

export class P5Drawer {
  public constructor(
    private readonly p: p5,
    public readonly cellSize: number,
  ) {
  }

  public draw(world: World): void {
    
  }
}