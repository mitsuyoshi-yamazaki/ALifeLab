import p5 from "p5"
import { strictEntries } from "../../classes/utilities"
import { World } from "./world"

type DrawModeMaterial = {
  readonly case: "material"
}
type DrawModeEnergy = {
  readonly case: "energy"
}
type DrawModeHeat = {
  readonly case: "heat"
}
type DrawModeStatus = {
  readonly case: "status"
  readonly text: string
}
type DrawMode = DrawModeMaterial | DrawModeEnergy | DrawModeHeat | DrawModeStatus
type DrawModes = DrawMode["case"]
type GenericDrawMode<T extends DrawModes> = T extends "material" ? DrawModeMaterial :
  T extends "energy" ? DrawModeEnergy :
  T extends "heat" ? DrawModeHeat :
  T extends "status" ? DrawModeStatus :
  never
  
export class P5Drawer {
  public get drawModes(): DrawModes[] {
    return strictEntries(this.drawMode).map(([key]) => key)
  }

  private drawMode: { [Key in DrawModes]?: GenericDrawMode<Key> } = {}

  public constructor(
    public readonly cellSize: number,
  ) {
  }

  public setDrawMode<T extends DrawModes>(drawMode: GenericDrawMode<T>): void {
    (this.drawMode[drawMode.case] as GenericDrawMode<T>) = drawMode
  }

  public removeDrawMode(drawMode: DrawModes): void {
    delete this.drawMode[drawMode]
  }

  public drawWorld(p: p5, world: World): void {
    p.background(0x00)

    if (this.drawMode["material"] != null) {
      this.drawMaterial(p, world)
    }
    if (this.drawMode["energy"] != null) {
      this.drawEnergy(p, world)
    }
    if (this.drawMode["heat"] != null) {
      this.drawHeat(p, world)
    }
    if (this.drawMode["status"] != null) {
      this.drawStatus(p, world, this.drawMode["status"])
    }
  }

  private drawMaterial(p: p5, world: World): void {
    p.noStroke()
    p.fill(0xFF)
    p.circle(100, 100, 100) // TODO:
  }

  private drawEnergy(p: p5, world: World): void {
    p.strokeWeight(8)
    p.stroke(0xFF, 0xFF, 0x0, 0x80)
    p.noFill()
    p.circle(100, 100, 100) // TODO:
  }

  private drawHeat(p: p5, world: World): void {
    p.strokeWeight(4)
    p.stroke(0xFF, 0x0, 0x0, 0x80)
    p.noFill()
    p.circle(100, 100, 100) // TODO:
  }

  private drawStatus(p: p5, world: World, status: DrawModeStatus): void {
    p.noStroke()
    p.fill(0xFF, 0xFF)
    p.textAlign(p.RIGHT)
    p.textStyle(p.NORMAL)
    p.textSize(8)

    const margin = 20
    p.text(status.text, world.size.x * this.cellSize - margin, margin)
  }
}