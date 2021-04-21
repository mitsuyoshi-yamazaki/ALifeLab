import { Vector } from "../../../src/classes/physics"
import { QuadtreeNode, QuadtreeObject } from "../../../src/simulations/drawer/quadtree"

function createObject(minX: number, minY: number, maxX: number, maxY: number): QuadtreeObject {
  return {
    edgePoints: [
      new Vector(minX, minY),
      new Vector(maxX, maxY),
    ]
  }
}

describe("Quadtree", () => {
  test("Instantiate", () => {
    const point1 = new Vector(0, 0)
    const point2 = new Vector(1, 1)
    expect(() => new QuadtreeNode(point1, point2, null)).not.toThrow()
    expect(() => new QuadtreeNode(point2, point1, null)).toThrow()
    expect(() => new QuadtreeNode(point1, point1, null)).toThrow()
  })

  test("Child nodes", () => {
    const node = new QuadtreeNode(new Vector(0, 0), new Vector(2, 2), null)
    const topLeft = node.nodeContains(createObject(0.1, 0.1, 0.9, 0.9))
    const topRight = node.nodeContains(createObject(1.1, 0.1, 1.9, 0.9))
    const bottomLeft = node.nodeContains(createObject(0.1, 1.1, 0.9, 1.9))
    const bottomRight = node.nodeContains(createObject(1.1, 1.1, 1.9, 1.9))

    expect(topLeft).not.toBeNull()
    expect(topRight).not.toBeNull()
    expect(bottomLeft).not.toBeNull()
    expect(bottomRight).not.toBeNull()

    if (topLeft == null || topRight == null || bottomLeft == null || bottomRight == null) {
      fail()
    }

    // top left
    expect(topLeft.minPoint.x).toBeCloseTo(0)
    expect(topLeft.minPoint.y).toBeCloseTo(0)
    expect(topLeft.maxPoint.x).toBeCloseTo(1)
    expect(topLeft.maxPoint.y).toBeCloseTo(1)

    // top right
    expect(topRight.minPoint.x).toBeCloseTo(1)
    expect(topRight.minPoint.y).toBeCloseTo(0)
    expect(topRight.maxPoint.x).toBeCloseTo(2)
    expect(topRight.maxPoint.y).toBeCloseTo(1)

    // bottom left
    expect(bottomLeft.minPoint.x).toBeCloseTo(0)
    expect(bottomLeft.minPoint.y).toBeCloseTo(1)
    expect(bottomLeft.maxPoint.x).toBeCloseTo(1)
    expect(bottomLeft.maxPoint.y).toBeCloseTo(2)
 
    // bottom right
    expect(bottomRight.minPoint.x).toBeCloseTo(1)
    expect(bottomRight.minPoint.y).toBeCloseTo(1)
    expect(bottomRight.maxPoint.x).toBeCloseTo(2)
    expect(bottomRight.maxPoint.y).toBeCloseTo(2)
  })

  test("Add object in this node", () => {
    const node = new QuadtreeNode(new Vector(0, 0), new Vector(2, 2), null)
    const obj1 = createObject(0.5, 0.5, 0.5, 1.5)
    const obj2 = createObject(0.5, 0.5, 1.5, 1.5)

    expect(node.nodeContains(obj1)).toStrictEqual(node)
    expect(node.nodeContains(obj2)).toStrictEqual(node)
  })

  test("Adding object fails", () => {
    const node = new QuadtreeNode(new Vector(0, 0), new Vector(1, 1), null)
    const obj: QuadtreeObject = {
      edgePoints: [
        new Vector(2, 2)
      ]
    }

    expect(node.nodeContains(obj)).toBeNull()
  })

  test("Retrieve objects those possibly affect", () => {
    const rootNode = new QuadtreeNode(new Vector(0, 0), new Vector(8, 8), null)
    const obj = createObject(1, 1, 3, 3)

    const collisionCheckObjects: QuadtreeObject[] = [
      createObject(0.5, 0.5, 1.5, 1.5),
      createObject(1, 3, 3, 1),
      createObject(3, 3, 5, 3),
      createObject(1, 1, 7, 7),
      createObject(7, 1, 7, 7),
    ]

    const otherObjects: QuadtreeObject[] = [
      createObject(5, 1, 7, 1),
      createObject(7.5, 7.5, 8, 8),
    ]
    
    const add = (obj: QuadtreeObject): void => {
      const node = rootNode.nodeContains(obj)
      expect(node).not.toBeNull()
      node?.objects.push(obj)
    }

    collisionCheckObjects.forEach(obj => add(obj))
    otherObjects.forEach(obj => add(obj))

    const node = rootNode.nodeContains(obj)
    if (node == null) {
      fail("node is null")
    }
    expect(node.minPoint.x).toBeCloseTo(rootNode.minPoint.x)
    expect(node.minPoint.y).toBeCloseTo(rootNode.minPoint.y)
    expect(node.maxPoint.x).toBeCloseTo(rootNode.minPoint.x + rootNode.size.x / 2)
    expect(node.maxPoint.y).toBeCloseTo(rootNode.minPoint.y + rootNode.size.y / 2)
    const objects = node?.collisionCheckObjects() ?? []
    expect(objects.length).toBe(collisionCheckObjects.length)

    objects.every(obj => {
      expect(collisionCheckObjects.includes(obj)).toBe(true)
      expect(otherObjects.includes(obj)).toBe(false)
    })
  })
})
