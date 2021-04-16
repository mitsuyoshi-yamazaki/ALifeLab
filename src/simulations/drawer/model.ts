import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { Drawer } from "./drawer"
import { LSystemDrawer, LSystemRule } from "./lsystem_drawer"
import { Line, isCollided } from "./line"
// Do not import constants (pass constants via Model.constructor)

export class Result {
  public constructor(
    public readonly t: number,
    public readonly reason: string,
    public readonly status: { numberOfLines: number },
    public readonly description: string,
  ) { }
}

export class Model {
  public showsBorderLine = false
  public lineCollisionEnabled = true

  private _t = 0
  private _isCompleted = false
  private _drawers: Drawer[] = []
  private _lines: Line[] = []
  private _result: Result | undefined

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
  ) {
    this.setupBorderLines()
    this._drawers.push(...this.setupFirstDrawers(lSystemRules))
  }

  public get t(): number {
    return this._t
  }
  public get isCompleted(): boolean {
    return this._isCompleted
  }
  public get result(): Result | undefined {
    return this._result
  }

  public next(): void {
    if (this.isCompleted) {
      return
    }
    const completionReason = this.completedReason()
    if (completionReason != undefined) {
      this._isCompleted = true
      const status = { numberOfLines: this._lines.length }
      const description = this.lSystemRules.map(rule => `\n- ${rule.encoded}`).join("")
      this._result = new Result(this.t, completionReason, status, description)

      return
    }

    const newDrawers: Drawer[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      if (this.isCollidedWithLines(action.line) === false) {
        newDrawers.push(...action.drawers)
        this._lines.push(action.line)
      }
    })

    this._drawers = newDrawers.map(drawer => {
      if (random(1) < this.mutationRate) {
        return drawer.mutated()
      }

      return drawer
    })

    this._t += 1
  }

  public draw(p: p5): void {
    this._lines.forEach(line => line.draw(p))
  }

  private setupFirstDrawers(rules: LSystemRule[]): Drawer[] {
    const padding = 100
    const randomPosition = (): Vector => {
      return new Vector(random(this.fieldSize.x - padding, padding), random(this.fieldSize.y - padding, padding))
    }
    const randomDirection = (): number => (random(360) - 180)
    const firstCondition = "A" // Since all random rule contains "A"

    return rules.map(rule => new LSystemDrawer(randomPosition(), randomDirection(), firstCondition, 1, rule))
  }

  private setupBorderLines() {
    const points: [Vector, Vector][] = []
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        points.push([
          new Vector(i * this.fieldSize.x, i * this.fieldSize.y),
          new Vector(j * this.fieldSize.x, ((j + 1) % 2) * this.fieldSize.y),
        ])
      }
    }

    let parent: Line | undefined
    points.forEach(p => {
      const line = new Line(p[0], p[1])
      line.isHidden = !this.showsBorderLine

      this._lines.push(line)
      parent = line
    })
  }

  private isCollidedWithLines(line: Line): boolean {
    if (this.lineCollisionEnabled === false) {
      return false
    }

    return this._lines.some(other => isCollided(line, other))
  }

  private completedReason(): string | undefined { // TODO: 適切な終了条件を設定する
    if (this._lines.length > this.maxLineCount) {
      return `Filled`
    }
    if (this._drawers.length === 0) {
      return `All died`
    }

    return undefined
  }
}
