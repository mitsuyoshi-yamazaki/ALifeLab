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
    const firstDrawer = this.setupFirstDrawer()
    this._drawers.push(firstDrawer)
    const lines: Line[] = []
    this._rootLine = this.setupRootLine()
    firstDrawer.currentLine = this._rootLine
  }
  public get t(): number {
    return this._t
  }
  public get isCompleted(): boolean {
    return this._isCompleted
  }

  public completion?(result: Result): void

  public next(p: p5): void {
    const draw = (node: Line) => {
      node.draw(p)
      node.children.forEach(child => draw(child))
    }

    if (this.isCompleted) {
      draw(this._rootLine)

      return
    }
    if (this._drawers.length > this.maxDrawerCount) { // TODO: 適切な終了条件を設定する
      this._isCompleted = true
      if (this.completion != undefined) {
        this.completion(new Result(this.t))
      }
      draw(this._rootLine)

      return
    }

    const deads: Drawer[] = []
    const newDrawers: Drawer[] = []
    const newLines: Line[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      if (this.isCollidedWithLines(action.line) === true) {
        deads.push(drawer)
      } else {
        newDrawers.push(...action.drawers)
        newLines.push(action.line)

        drawer.currentLine?.children.push(action.line)
        drawer.currentLine = action.line
        action.drawers.forEach(d => {
          d.currentLine?.children.push(action.line)
          d.currentLine = action.line
        })
      }
    })

    this._drawers.push(...newDrawers)
    newLines.forEach(line => {
      line.draw(p)
    })
    this._lines.push(...newLines)

    this._drawers = this._drawers.filter(drawer => {
      return deads.includes(drawer) === false
    })

    draw(this._rootLine)

    this._t += 1
  }

  private setupFirstDrawer(): Drawer {
    const position = new Vector(this.fieldSize.x / 2, this.fieldSize.y - 100)
    const rule = new Map<string, string>()
    rule.set("A", "A+B")
    rule.set("B", "A")
    const ruleConstants = new Map<string, number>()
    ruleConstants.set("+", 30)

    const direction = 270

    return new LSystemDrawer(position, direction, "A", 1, rule, ruleConstants)
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
