import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Drawer, LSystemDrawer } from "./drawer"
import { Line, isCollided } from "./line"
// Do not import constants (pass constants via Model.constructor)

export class Result {
  public constructor(
    public readonly t: number,
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

  public constructor(public readonly fieldSize: Vector, public readonly maxDrawerCount: number) {
    this._rootLine = this.setupRootLine()
    const firstDrawer = this.setupFirstDrawer(this._rootLine)
    this._drawers.push(firstDrawer)
  }

  public get t(): number {
    return this._t
  }
  public get isCompleted(): boolean {
    return this._isCompleted
  }

  public completion?(result: Result): void

  public next(): void {
    if (this.isCompleted) {
      return
    }
    if (this._drawers.length > this.maxDrawerCount) { // TODO: 適切な終了条件を設定する // TODO: 生存者なしによる終了
      this._isCompleted = true
      if (this.completion != undefined) {
        this.completion(new Result(this.t))
      }

      return
    }

    const newDrawers: Drawer[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      if (this.isCollidedWithLines(action.line) === false) {
        newDrawers.push(...action.drawers)
        this._lines.push(action.line)
        drawer.parentLine.children.push(action.line)
      }
    })

    this._drawers = newDrawers

    this._t += 1
  }

  public draw(p: p5): void {
    const draw = (node: Line) => {
      node.draw(p)
      node.children.forEach(child => draw(child))
    }
    draw(this._rootLine)
  }

  private setupFirstDrawer(rootLine: Line): Drawer {
    const position = new Vector(this.fieldSize.x / 2, this.fieldSize.y - 100)
    const rule = new Map<string, string>()
    rule.set("A", "A+B")
    rule.set("B", "A")
    const ruleConstants = new Map<string, number>()
    ruleConstants.set("+", 25)

    const direction = 270

    return new LSystemDrawer(position, direction, "A", 1, rule, ruleConstants, rootLine)
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
      line.fixedWeight = 4
      line.isHidden = !this.showsBorderLine

      if (root == undefined) {
        root = line
      }
      parent?.children.push(line)
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
}
