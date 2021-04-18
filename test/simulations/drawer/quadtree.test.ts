import { Vector } from "../../../src/classes/physics"
import { QuadtreeNode, QuadtreeObject } from "../../../src/simulations/drawer/quadtree"


describe("Quadtree", () => {
  test("Instantiate", () => {
    const point1 = new Vector(0, 0)
    const point2 = new Vector(1, 1)
    expect(() => new QuadtreeNode(point1, point2)).not.toThrow()
    expect(() => new QuadtreeNode(point2, point1)).toThrow()
    expect(() => new QuadtreeNode(point1, point1)).toThrow()
  })

  test("Child nodes", () => {
    const subset = (new QuadtreeNode(new Vector(0, 0), new Vector(2, 2))).children

    // top left
    expect(subset.topLeft.minPoint.x).toBeCloseTo(0)
    expect(subset.topLeft.minPoint.y).toBeCloseTo(0)
    expect(subset.topLeft.maxPoint.x).toBeCloseTo(1)
    expect(subset.topLeft.maxPoint.y).toBeCloseTo(1)

    // top right
    expect(subset.topRight.minPoint.x).toBeCloseTo(1)
    expect(subset.topRight.minPoint.y).toBeCloseTo(0)
    expect(subset.topRight.maxPoint.x).toBeCloseTo(2)
    expect(subset.topRight.maxPoint.y).toBeCloseTo(1)

    // bottom left
    expect(subset.bottomLeft.minPoint.x).toBeCloseTo(0)
    expect(subset.bottomLeft.minPoint.y).toBeCloseTo(1)
    expect(subset.bottomLeft.maxPoint.x).toBeCloseTo(1)
    expect(subset.bottomLeft.maxPoint.y).toBeCloseTo(2)
 
    // bottom right
    expect(subset.bottomRight.minPoint.x).toBeCloseTo(1)
    expect(subset.bottomRight.minPoint.y).toBeCloseTo(1)
    expect(subset.bottomRight.maxPoint.x).toBeCloseTo(2)
    expect(subset.bottomRight.maxPoint.y).toBeCloseTo(2)
  })

  test("Add object in this node", () => {
    const node = new QuadtreeNode(new Vector(0, 0), new Vector(2, 2))
    const obj1: QuadtreeObject = {
      edgePoints: [
        new Vector(0.5, 0.5),
        new Vector(0.5, 1.5)
      ]
    }
    const obj2: QuadtreeObject = {
      edgePoints: [
        new Vector(0.5, 0.5),
        new Vector(1.5, 1.5)
      ]
    }

    expect(node.nodeContains(obj1)).toStrictEqual(node)
    expect(node.nodeContains(obj2)).toStrictEqual(node)
  })

  test("Add object in child node", () => {
    const node = new QuadtreeNode(new Vector(0, 0), new Vector(2, 2))
    const obj: QuadtreeObject = {
      edgePoints: [
        new Vector(0.25, 0.25),
        new Vector(0.75, 0.75),
      ]
    }

    expect(node.nodeContains(obj)).toStrictEqual(node.children.topLeft)
  })

  test("Adding object fails", () => {
    const node = new QuadtreeNode(new Vector(0, 0), new Vector(1, 1))
    const obj: QuadtreeObject = {
      edgePoints: [
        new Vector(2, 2)
      ]
    }

    expect(node.nodeContains(obj)).toBeNull()
  })
})
