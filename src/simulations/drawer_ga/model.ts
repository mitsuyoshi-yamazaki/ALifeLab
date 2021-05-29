import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { LSystemRule, defaultInitialCondition } from "../drawer/lsystem_rule"
import { LSystemDrawer } from "../drawer/lsystem_drawer"
import { Line, isCollided } from "../drawer/line"
import { QuadtreeNode } from "../drawer/quadtree"
import { Seed } from "./seed"

export class GAModel {
  public showsQuadtree = false

  private _rootNode: QuadtreeNode
  private _seeds: Seed[] = []
  private _environmentLines: Line[] = []

  public constructor(
    public readonly fieldSize: Vector,
  ) {
    this._rootNode = new QuadtreeNode(new Vector(0, 0), fieldSize, null)
    this.setupBorderLines()
  }

  public addSeed(seed: Seed, position: Vector, direction: number): void {
    this._seeds.push(seed)


  }

  public execute(): void {

  }

  public draw(p: p5): void {
    p.background(0xFF)
  }

  /* private methods */
  private setupBorderLines() {
    const rect = Line.rect(Vector.zero(), this.fieldSize)

    rect.forEach(line => {
      line.isHidden = true
      this.addLine(line, this._rootNode)
    })
  }

  private addLine(line: Line, node: QuadtreeNode | null): void {
    if (node != null) {
      node.objects.push(line)
    }
    this._environmentLines.push(line)
  }
}
