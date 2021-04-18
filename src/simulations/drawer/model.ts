import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { Drawer } from "./drawer"
import { LSystemDrawer, LSystemRule } from "./lsystem_drawer"
import { Line, isCollided } from "./line"
import { QuadtreeNode } from "./quadtree"
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
  public showsQuadtree = false
  public lineCollisionEnabled = true
  public quadtreeEnabled = true
  public concurrentExecutionNumber = 1

  public get t(): number {
    return this._t
  }

  public get isCompleted(): boolean {
    return this._isCompleted
  }

  public get result(): Result | undefined {
    return this._result
  }

  private _t = 0
  private _isCompleted = false
  private _drawers: Drawer[] = []
  private _lines: Line[] = []
  private _result: Result | undefined
  private _rootNode: QuadtreeNode

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
        public readonly lineLifeSpan: number,
        public readonly lineLengthType: number,
  ) {
    this._rootNode = new QuadtreeNode(new Vector(0, 0), fieldSize, null)
    this.setupBorderLines()
    this._drawers.push(...this.setupFirstDrawers(lSystemRules))
  }

  public execute(): void {
    this.executeSteps(this.concurrentExecutionNumber)
  }

  public draw(p: p5): void {
    this._lines.forEach(line => line.draw(p))

    if (this.showsQuadtree) {
      this._rootNode.draw(p)
    }
  }

  private setupFirstDrawers(rules: LSystemRule[]): Drawer[] {
    const padding = 100
    const randomPosition = (): Vector => {
      return new Vector(random(this.fieldSize.x - padding, padding), random(this.fieldSize.y - padding, padding))
    }
    const randomDirection = (): number => (random(360) - 180)

    return rules.map(rule => new LSystemDrawer(
      randomPosition(),
      randomDirection(),
      LSystemRule.initialCondition,
      1,
      rule,
      this.lineLengthType
    ))
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

    points.forEach(p => {
      const line = new Line(p[0], p[1])
      line.isHidden = !this.showsBorderLine

      this.addLine(line, this.nodeContains(line))
    })
  }

  private executeSteps(drawerCount: number): void {
    if (this.isCompleted === true || drawerCount <= 0) {
      return
    }
    drawerCount -= this._drawers.length

    const completionReason = this.completedReason()
    if (completionReason != undefined) {
      this._isCompleted = true
      const status = { numberOfLines: this._lines.length }
      const description = this.lSystemRules.map(rule => `\n- ${rule.encoded}`).join("")
      this._result = new Result(this.t, completionReason, status, description)

      return
    }

    if (this.lineLifeSpan > 0) {
      if (this._lines.length > this.lineLifeSpan) {
        if(this.quadtreeEnabled) {
          throw new Error("四分木導入のため正常動作せず")
        }
        const initLine = this._lines.slice(0, 4)
        this._lines = initLine.concat(this._lines.slice(Math.floor(this._lines.length / this.lineLifeSpan) + 5, this._lines.length - 4))
      }
    }

    const newDrawers: Drawer[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      const node = this.nodeContains(action.line)
      if (this.isCollidedWithLines(action.line, node) === false) {
        newDrawers.push(...action.drawers)
        this.addLine(action.line, node)
      }
    })

    this._drawers = newDrawers.map(drawer => {
      if (random(1) < this.mutationRate) {
        return drawer.mutated()
      }

      return drawer
    })

    this._t += 1
    this.executeSteps(drawerCount)
  }

  private nodeContains(line: Line): QuadtreeNode | null {
    if (this.quadtreeEnabled === false) {
      return null
    }

    return this._rootNode.nodeContains(line)
  }

  private isCollidedWithLines(line: Line, node: QuadtreeNode | null): boolean {
    if (this.lineCollisionEnabled === false) {
      return false
    }

    const lines = node?.collisionCheckObjects() as Line[] ?? this._lines
    return lines.some(other => isCollided(line, other))
  }

  private addLine(line: Line, node: QuadtreeNode | null): void {
    if (this.quadtreeEnabled === true) {
      if (node == null) {
        // console.log(`line (${line.start}, ${line.end}) cannot find node`)  // FixMe: 領域外へ向かう枝はここの条件に入る
        this._rootNode.objects.push(line)
      } else {
        node.objects.push(line)
      }
    }
    this._lines.push(line)
  }

  private removeLine(line: Line): void {
    // TODO:
  }

  private completedReason(): string | undefined { // TODO: 適切な終了条件を設定する
    // TODO: 定命モードの終了条件
    if (this._lines.length > this.maxLineCount) {
      return "Filled"
    }
    if (this._drawers.length === 0) {
      return "All died"
    }

    return undefined
  }
}
