import p5 from "p5"
import { strictEntries } from "../../classes/utilities"
import { Terrain, TerrainCell } from "./terrain"
import { World } from "./world"

type DrawModeMaterial = {
  readonly case: "material"
}
type DrawModeLife = {
  readonly case: "life"
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
type DrawMode = DrawModeMaterial | DrawModeLife | DrawModeEnergy | DrawModeHeat | DrawModeStatus
type DrawModes = DrawMode["case"]
type InnerCellDrawModes = DrawModeMaterial["case"] | DrawModeLife["case"] | DrawModeEnergy["case"] | DrawModeHeat["case"]
type GenericDrawMode<T extends DrawModes> = T extends "material" ? DrawModeMaterial :
  T extends "energy" ? DrawModeEnergy :
  T extends "life" ? DrawModeLife :
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

    const drawModes = this.drawModes
    const drawTargets: { [Draw in InnerCellDrawModes]: boolean } = {
      material: drawModes.includes("material"),
      life: drawModes.includes("life"),
      energy: drawModes.includes("energy"),
      heat: drawModes.includes("heat"),
    }

    world.terrain.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.drawTerrainCell(p, cell, x, y, drawTargets)
      })
    })

    if (this.drawMode["status"] != null) {
      this.drawStatus(p, world, this.drawMode["status"])
    }
  }

  private drawTerrainCell(p: p5, cell: TerrainCell, x: number, y: number, drawTargets: { [Draw in InnerCellDrawModes]: boolean }): void {
    const cellSize = this.cellSize

    if (drawTargets.material === true) {
      // TODO:
    }

    if (drawTargets.life === true) {
      cell.hull.forEach(hull => {
        p.noStroke()
        p.fill(0xFF, 0xC0)
        p.ellipse(x * cellSize, y * cellSize, cellSize, cellSize)
      })
    }

    if (drawTargets.energy === true) {
      const energyMeanAmount = 10 // FixMe:

      p.noStroke()
      const alpha = Math.floor((cell.amount.energy / energyMeanAmount) * 0x80)
      p.fill(0xFF, 0xFF, 0x00, alpha)
      p.rect(x * cellSize, y * cellSize, cellSize, cellSize)
    }

    if (drawTargets.heat === true) {
      const heatMeanAmount = 10 // FixMe: 

      p.noStroke()
      const alpha = Math.floor((cell.heat / heatMeanAmount) * 0x80)
      p.fill(0xFF, 0x00, 0x00, alpha)
      p.rect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
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