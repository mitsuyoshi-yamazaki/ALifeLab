import p5 from "p5"
import { Vector } from "../../classes/physics"
import { LSystemRule } from "../drawer/lsystem_rule"
import { Model } from "../drawer/model"

export class MortalModel extends Model {
  private numberOfNodes = 1
  private launchTime = Date.now() // ms

  public constructor(
    public readonly fieldSize: Vector,
    public readonly maxLineCount: number,
    public readonly lSystemRules: LSystemRule[],
    public readonly mutationRate: number,
    public readonly lineLifeSpan: number,
    public readonly isContinuous: boolean,
    fixedStartPoint: boolean,
  ) {
    super(fieldSize, maxLineCount, lSystemRules, mutationRate, 1, fixedStartPoint)
  }

  public draw(p: p5, showsQuadtree: boolean): void {
    if (showsQuadtree === true) {
      this._rootNode.draw(p)
    }
    this._lines.forEach(line => line.draw(p, 0xFF))
  }

  protected checkCompleted(): void {
    if (this.isContinuous === true) {
      return
    }

    if (this._lines.length > this.maxLineCount) {
      this._result = this.currentResult("Filled")
      return
    }
    if (this._drawers.length === 0) {
      this._result = this.currentResult("All died")
      return
    }
    if (Date.now() - this.launchTime > 20 * 1000) {
      this._result = this.currentResult("Timeout")
      return
    }

    if (this._t % 2000 !== 0) {
      return
    }
    const numberOfNodes = this._rootNode.numberOfNodes()
    if (numberOfNodes === this.numberOfNodes) {
      this._result = this.currentResult("Stable")
      return
    }
    this.numberOfNodes = numberOfNodes
  }

  protected preExecution(): void {
    this.removeOldLines()
  }

  private removeOldLines(): void {
    if (this.lineLifeSpan > 0) {
      const removingLineCount = Math.floor(this._lines.length / this.lineLifeSpan)
      if (this._lines.length <= removingLineCount) {
        return
      }
      const borderLineCount = 4
      const borderLines = this._lines.slice(0, borderLineCount)
      if (this.quadtreeEnabled === true) {
        const removingLines = this._lines.splice(borderLineCount, Math.floor(this._lines.length / this.lineLifeSpan) + borderLineCount)
        removingLines.forEach(line => {
          const node = this.nodeContains(line)
          if (node != null) {
            node.objects = node.objects.filter(obj => obj !== line)
          } else {
            console.log(`Enabled quadtree but no node contains line (${line.start}, ${line.end})`)
          }
        })
      } else {
        this._lines = borderLines.concat(this._lines.slice(removingLineCount + borderLineCount, this._lines.length - borderLineCount))
      }
    }
  }
}
