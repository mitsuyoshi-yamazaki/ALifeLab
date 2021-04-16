import p5 from "p5"
import { Vector } from "../../classes/physics"
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
  private _rootLine: Line
  private _result: Result | undefined

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRule: LSystemRule,
  ) {
    this._rootLine = this.setupRootLine()
    const firstDrawer = this.setupFirstDrawer(this._rootLine, lSystemRule)
    this._drawers.push(firstDrawer)
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
      this._result = new Result(this.t, completionReason, status, this.lSystemRule.encoded)

      return
    }

    const newDrawers: Drawer[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      if (this.isCollidedWithLines(action.line) === false) {
        newDrawers.push(...action.drawers)
        this._lines.push(action.line)
        // drawer.parentLine.children.push(action.line)
      }
    })

    this._drawers = newDrawers

    this._t += 1
  }

  public draw(p: p5): void {
    // const draw = (node: Line) => {
    //   node.draw(p)
    //   node.children.forEach(child => draw(child))
    // }
    // draw(this._rootLine)
    this._lines.forEach(line => line.draw(p))
  }

  private setupFirstDrawer(rootLine: Line, rule: LSystemRule): Drawer {
    const position = new Vector(this.fieldSize.x / 2, this.fieldSize.y - 100)
    const direction = 270

    return new LSystemDrawer(position, direction, "A", 1, rule, rootLine)
  }

  private setupRootLine(): Line {
    const points: [Vector, Vector][] = []
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        points.push([
          new Vector(i * this.fieldSize.x, i * this.fieldSize.y),
          new Vector(j * this.fieldSize.x, ((j + 1) % 2) * this.fieldSize.y),
        ])
      }
    }

    let root: Line | undefined
    let parent: Line | undefined
    points.forEach(p => {
      const line = new Line(p[0], p[1])
      // line.fixedWeight = 4
      line.isHidden = !this.showsBorderLine

      if (root == undefined) {
        root = line
      }
      // parent?.children.push(line)
      this._lines.push(line)
      parent = line
    })
    if (root == undefined) {
      throw new Error()
    }

    return root
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