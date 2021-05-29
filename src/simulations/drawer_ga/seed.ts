import { LSystemRule } from "../drawer/lsystem_rule"
import { LSystemDrawer } from "../drawer/lsystem_drawer"
import { Line } from "../drawer/line"

export class Seed {
  public get drawers(): LSystemDrawer[] {
    return this._drawers
  }
  public get lines(): Line[] {
    return this._lines
  }

  private _branchRemains: number
  private _drawers: LSystemDrawer[] = []
  private readonly _lines: Line[] = []

  public constructor(
    public readonly rule: LSystemRule,
    life: number,
  ) {
    this._branchRemains = life
  }

  public addLife(life: number): void {
    if (life < 0) {
      throw new Error(`lifeが負数です ${life}`)
    }
    this._branchRemains += life
  }

  public replaceDrawers(drawers: LSystemDrawer[]): void {
    this._drawers = drawers
  }

  public addLines(lines: Line[]): void {
    this._lines.push(...lines)
  }
}