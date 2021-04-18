import p5 from "p5"
import { Vector } from "../../classes/physics"

export interface QuadtreeObject {
  edgePoints: Vector[]
}

export class QuadtreeSubset {
  public get nodes(): QuadtreeNode[] {
    return [
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight
    ]
  }

  public constructor(
    public readonly topLeft: QuadtreeNode,
    public readonly topRight: QuadtreeNode,
    public readonly bottomLeft: QuadtreeNode,
    public readonly bottomRight: QuadtreeNode
  ) { }
}

export class QuadtreeNode {
  private _children: QuadtreeSubset | null

  public objects: QuadtreeObject[] = []
  public size: Vector
  public get children(): QuadtreeSubset {
    if (this._children != null) {
      return this._children
    }
    const children = this.createChildren()
    this._children = children
    return children
  }

  // MEMO: Circular references shouldn't be an issue
  // Mark-and-sweep algorithm https://developer.mozilla.org/ja/docs/Web/JavaScript/Memory_Management
  constructor(public readonly minPoint: Vector, public readonly maxPoint: Vector, public readonly parent: QuadtreeNode | null) {
    if (minPoint.x >= maxPoint.x || minPoint.y >= maxPoint.y) {
      throw new Error(`maxPoint should be larger than minPoint (minPoint: ${minPoint}, maxPoint: ${maxPoint})`)
    }
    this.size = maxPoint.sub(minPoint)
  }

  // return: objを格納できる最小のQuadtreeNode
  public nodeContains(obj: QuadtreeObject): QuadtreeNode | null {
    if (this.canContain(obj) === false) {
      return null
    }
    
    const subset = this.children
    for (let i = 0; i < subset.nodes.length; i += 1) {
      const node = subset.nodes[i].nodeContains(obj)
      if (node != null) {
        return node
      }
    }
    return this
  }

  public canContain(obj: QuadtreeObject): boolean {
    return obj.edgePoints.every(point => point.in(this.minPoint, this.maxPoint))
  }

  public collisionCheckObjects(): QuadtreeObject[] {
    if (this.parent == null) {
      return this.objects.concat([])
    }
    return this.objects.concat(this.parent.collisionCheckObjects())
  }

  public draw(p: p5): void {
    const weight = 0.5
    const halfWeight = weight / 2
    p.noFill()
    p.strokeWeight(weight)
    p.stroke(60, 85, 247)

    p.rect(this.minPoint.x - halfWeight, this.minPoint.y - halfWeight, this.size.x + weight, this.size.y + weight)

    this._children?.nodes.forEach(node => node.draw(p))
  }

  private createChildren(): QuadtreeSubset {
    const centerX = this.minPoint.x + this.size.x / 2
    const centerY = this.minPoint.y + this.size.y / 2
    return new QuadtreeSubset(
      new QuadtreeNode(this.minPoint, new Vector(centerX, centerY), this),
      new QuadtreeNode(new Vector(centerX, this.minPoint.y), new Vector(this.maxPoint.x, centerY), this),
      new QuadtreeNode(new Vector(this.minPoint.x, centerY), new Vector(centerX, this.maxPoint.y), this),
      new QuadtreeNode(new Vector(centerX, centerY), this.maxPoint, this),
    )
  }
}