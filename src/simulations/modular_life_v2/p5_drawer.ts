import p5 from "p5"
import { Color } from "../../classes/color"
import { strictEntries } from "../../classes/utilities"
import { ModuleType } from "./module/module"
import { TransferrableMaterialType } from "./physics/material"
import { TerrainCell } from "./terrain"
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
  
const moduleColor: { [M in ModuleType]: Color } = {
  hull: new Color(0xFF, 0xFF, 0xFF),
  computer: new Color(0xFF, 0xFF, 0xFF),
  assembler: new Color(0xFF, 0xFF, 0xFF),
  channel: new Color(0xFF, 0xFF, 0x00),
  mover: new Color(0x60, 0x60, 0x60),
  materialSynthesizer: new Color(0xFF, 0xFF, 0xFF),
}

const materialColor: { [M in TransferrableMaterialType]: Color } = {
  energy: new Color(0xFF, 0xFF, 0x00),
  nitrogen: new Color(0xFF, 0xFF, 0xFF),
  carbon: new Color(0xFF, 0xFF, 0xFF),
  fuel: new Color(0xFF, 0xFF, 0xFF),
  substance: new Color(0xFF, 0xFF, 0xFF),
}

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
    p.background(0x22)

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
    const cellRadius = cellSize / 2

    p.ellipseMode(p.CENTER)
    p.rectMode(p.CORNER)

    if (drawTargets.material === true) {
      // TODO:
    }

    if (drawTargets.life === true) {
      cell.hull.forEach(hull => {
        const size = (hull.size / 5) * cellSize
        const centerX = x * cellSize + cellRadius
        const centerY = y * cellSize + cellRadius

        const hullWeight = size / 4
        const hullColor = moduleColor.hull.p5(p)
        p.noStroke()
        p.fill(hullColor)
        p.ellipse(centerX, centerY, size, size)

        if (hull.amount.energy > 0) {
          const drawSize = Math.min(hull.amount.energy / hull.capacity, 1) * size

          p.fill(materialColor.energy.p5(p))
          p.ellipse(centerX, centerY, drawSize, drawSize)
        }

        p.strokeWeight(hullWeight)
        p.strokeCap(p.SQUARE)

        const moverCount = Object.keys(hull.internalModules.mover).length
        if (moverCount > 0) {
          const drawSize = p.PI * 2 * (moverCount / ((hull.size - 1) * 4))
          const fromAngle = (p.PI / 2) - (drawSize / 2)
          const toAngle = fromAngle + drawSize

          p.stroke(moduleColor.mover.p5(p))
          p.noFill()
          p.arc(centerX, centerY, size, size, fromAngle, toAngle)
        }

        const channelCount = Object.keys(hull.internalModules.channel).length
        if (channelCount > 0) {
          const drawSize = p.PI * 2 * (channelCount / ((hull.size - 1) * 4))
          const fromAngle = (p.PI / 2) * 3 - (drawSize / 2)
          const toAngle = fromAngle + drawSize

          p.stroke(moduleColor.channel.p5(p))
          p.noFill()
          p.arc(centerX, centerY, size, size, fromAngle, toAngle)
        }
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