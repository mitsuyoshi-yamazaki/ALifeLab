import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { LSystemRule } from "./lsystem_rule"
import { LSystemDrawer } from "./lsystem_drawer"
import { Line, isCollided } from "./line"
import { QuadtreeNode } from "./quadtree"
// Do not import constants (pass constants via Model.constructor)

export interface RuleDescription {
  rule: string
  numberOfDrawers: number  // 停止時点でのdrawer数
}

export class Result {
  public constructor(
    public readonly t: number,
    public readonly reason: string,
    public readonly status: {
      numberOfLines: number,
      numberOfNodes: number,
    },
    public readonly rules: RuleDescription[],
    public readonly description: string,
  ) { }
}

export class Model {
  public showsBorderLine = false  // TODO: 消す
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

  protected _t = 0
  protected _isCompleted = false
  protected _drawers: LSystemDrawer[] = []
  protected _lines: Line[] = []
  protected _result: Result | undefined
  protected _rootNode: QuadtreeNode

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
    public readonly lineLengthType: number,
    fixedStartPoint: boolean,
  ) {
    this._rootNode = new QuadtreeNode(new Vector(0, 0), fieldSize, null)
    this.setupBorderLines()
    this._drawers.push(...this.setupFirstDrawers(lSystemRules, fixedStartPoint))
  }

  public execute(): void {
    this.executeSteps(this.concurrentExecutionNumber)
  }

  public currentResult(completionReason: string): Result {
    const status = {
      numberOfLines: this._lines.length,
      numberOfNodes: this._rootNode.numberOfNodes(),
    }
    const description = ""
    const rules = this.lSystemRules.map(rule => {
      return {
        rule: rule.encoded,
        numberOfDrawers: this._drawers.filter(drawer => drawer.rule === rule).length
      }
    })
    return new Result(this.t, completionReason, status, rules, description)
  }

  public draw(p: p5, showsQuadtree: boolean): void {
    this._lines.forEach(line => line.draw(p))

    if (showsQuadtree === true) {
      this._rootNode.draw(p)
    }
  }

  protected preExecution(): void {
  }

  private setupFirstDrawers(rules: LSystemRule[], fixedStartPoint: boolean): LSystemDrawer[] {
    const padding = 100
    const position = (): Vector => {
      if (fixedStartPoint && rules.length === 1) {
        return this.fieldSize.div(2)
      }
      return new Vector(random(this.fieldSize.x - padding, padding), random(this.fieldSize.y - padding, padding))
    }
    const direction = (): number => {
      if (fixedStartPoint && rules.length === 1) {
        return 270
      }
      return random(360) - 180
    }

    return rules.map(rule => new LSystemDrawer(
      position(),
      direction(),
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
      this._result = this.currentResult(completionReason)
      return
    }

    this.preExecution()

    const newDrawers: LSystemDrawer[] = []
    this._drawers.forEach(drawer => {
      const action = drawer.next()
      if (this.quadtreeEnabled) {
        const node = this.nodeContains(action.line)

        // Since this._rootNode.nodeContains() returns null, the line is crossing this model's border
        if (node != null && this.isCollidedQuadtree(action.line, node) === false) {
          newDrawers.push(...action.drawers)
          this.addLine(action.line, node)
        }
      } else {
        if (this.isCollided(action.line) === false) {
          newDrawers.push(...action.drawers)
          this.addLine(action.line, null)
        }
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

  private isCollided(line: Line): boolean {
    return this._lines.some(other => isCollided(line, other))
  }

  private isCollidedQuadtree(line: Line, node: QuadtreeNode): boolean {
    if (this.lineCollisionEnabled === false) {
      return false
    }
    const lines = node.collisionCheckObjects() as Line[]
    return lines.some(other => isCollided(line, other))
  }

  private addLine(line: Line, node: QuadtreeNode | null): void {
    if (this.quadtreeEnabled === true && node != null) {
      node.objects.push(line)
    }
    this._lines.push(line)
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

export class ImmortalModel extends Model {
}