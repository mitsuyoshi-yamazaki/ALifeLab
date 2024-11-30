import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { LSystemRule, defaultInitialCondition } from "./lsystem_rule"
import { LSystemDrawer } from "./lsystem_drawer"
import { Line, isCollided } from "./line"
import { QuadtreeNode } from "./quadtree"
import { ColorTheme } from "./color_theme"
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

export type ModelOptions = {
  lineWeight?: number,
}

export class Model {
  public showsBorderLine = false  // TODO: 消す
  public lineCollisionEnabled = true
  public quadtreeEnabled = true
  public concurrentExecutionNumber = 1

  public get t(): number {
    return this._t
  }

  public get result(): Result | null {
    return this._result
  }

  public get isCompleted(): boolean {
    return this._result != null
  }

  protected _t = 0
  protected _drawers: LSystemDrawer[] = []
  protected get _lines(): Line[] {
    return this.__lines
  }
  protected __lines: Line[] = []
  protected _result: Result | null
  protected _rootNode: QuadtreeNode
  protected _lineWeight: number

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
    lineLengthType: number,
    colorTheme: ColorTheme,
    fixedStartPoint: boolean,
    addObstacle: boolean,
    options?: ModelOptions,
  ) {
    this.initializeMembers()
    this._rootNode = new QuadtreeNode(new Vector(0, 0), fieldSize, null)
    this.setupBorderLines()
    if (addObstacle) {
      this.setupObstacle()
    }
    this._drawers.push(...this.setupFirstDrawers(lSystemRules, fixedStartPoint, lineLengthType, colorTheme))

    this._lineWeight = options?.lineWeight ?? 0.5
  }

  protected initializeMembers(): void {
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
    if (showsQuadtree === true) {
      this._rootNode.draw(p)
    }
    this._lines.forEach(line => this.drawLine(line, 0x80, this._lineWeight, p))
  }

  protected checkCompleted(): void {
    throw new Error("Implement it!")
  }

  protected preExecution(): void {
  }

  protected nodeContains(line: Line): QuadtreeNode | null {
    if (this.quadtreeEnabled === false) {
      return null
    }

    return this._rootNode.nodeContains(line)
  }

  protected drawLine(line: Line, alpha: number, weight: number, p: p5): void {  // TODO: alpha引数は外せると思う
    if (line.isHidden === true) {
      return
    }

    const color = line.color.p5(p, alpha)
    p.stroke(color)
    p.strokeWeight(weight)
    p.line(line.start.x, line.start.y, line.end.x, line.end.y)
  }

  protected newDrawer(position: Vector, direction: number, condition: string, rule: LSystemRule, lineLengthType: number, colorTheme: ColorTheme): LSystemDrawer {
    return new LSystemDrawer(
      position,
      direction,
      condition,
      1,
      rule,
      lineLengthType,
      colorTheme,
    )
  }

  protected setupFirstDrawers(rules: LSystemRule[], fixedStartPoint: boolean, lineLengthType: number, colorTheme: ColorTheme): LSystemDrawer[] {
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

    return rules.map(rule => this.newDrawer(
      position(),
      direction(),
      defaultInitialCondition,
      rule,
      lineLengthType,
      colorTheme,
    ))
  }

  private setupBorderLines() {  // TODO: Line.rect()に置き換え
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

  private setupObstacle() {
    const center = this.fieldSize.div(2)
    const size = this.fieldSize.div(3)
    const origin = center.sub(size.div(2))
    const rect = Line.rect(origin, size)

    rect.forEach(line => {
      line.isHidden = !this.showsBorderLine
      this.addLine(line, this.nodeContains(line))
    })
  }

  protected executeSteps(drawerCount: number): void {
    if (this.isCompleted === true || drawerCount <= 0) {
      return
    }
    this.checkCompleted()
    if (this._drawers.length <= 0) {
      return
    }
    drawerCount -= this._drawers.length

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

  protected isCollided(line: Line): boolean {
    return this._lines.some(other => isCollided(line, other))
  }

  protected isCollidedQuadtree(line: Line, node: QuadtreeNode): boolean {
    if (this.lineCollisionEnabled === false) {
      return false
    }
    const lines = node.collisionCheckObjects() as Line[]
    return lines.some(other => isCollided(line, other))
  }

  protected addLine(line: Line, node: QuadtreeNode | null): void {
    if (this.quadtreeEnabled === true && node != null) {
      node.objects.push(line)
    }
    this._lines.push(line)
  }

  protected removeLine(line: Line): void {
    const node = this.nodeContains(line)
    if (node != null) {
      node.objects = node.objects.filter(obj => obj !== line)
    } else {
      console.log(`Enabled quadtree but no node contains line (${line.start}, ${line.end})`)
    }
  }
}

export class ImmortalModel extends Model {
  protected checkCompleted(): void {
    const completionReason = this.completedReason()
    if (completionReason != null) {
      this._result = this.currentResult(completionReason)
      return
    }
  }

  protected preExecution(): void {
  }

  private completedReason(): string | null {
    if (this._lines.length > this.maxLineCount) {
      return "Filled"
    }
    if (this._drawers.length === 0) {
      return "All died"
    }

    return null
  }
}