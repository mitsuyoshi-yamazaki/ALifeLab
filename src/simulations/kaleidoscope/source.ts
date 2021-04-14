import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random, toggleFullscreen } from "../../classes/utilities"

const fieldSize = 600
const strokeWeight = 5
const centerPoint = new Vector(fieldSize / 2, fieldSize / 2)

let t = 0
const canvasId = "canvas"
const objects: Obj[] = []

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    setupObjects()

    p.background(0, 0xFF)
  }

  p.draw = () => {
    p.background(0, 0xFF)

    objects.forEach(obj => {
      obj.rotation += Math.PI / 180
      obj.draw(p, centerPoint)
    })

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function setupObjects() {
  const size = 100
  const rotation = 0
  const spacing = size - strokeWeight
  const referencePoint = centerPoint.sub(new Vector(spacing, spacing))

  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      const position = referencePoint.add(new Vector(spacing * i, spacing * j))
      const obj = new Obj(position, size, rotation)
      console.log(`position: ${String(position)}`)
      objects.push(obj)
    }
  }
}

class Model {

}

class Obj {
  public transform: Transform | undefined

  public constructor(public position: Vector, public size: number, public rotation: number) {
  }

  public draw(p: p5, origin: Vector): void {
    p.noFill()
    p.stroke(0xFF, 0x80)
    p.strokeWeight(strokeWeight)
    p.translate(fieldSize / 2, fieldSize / 2)
    p.rotate(this.rotation)
    p.rect(origin.x + this.position.x, origin.y + this.position.y, this.size, this.size)
  }
}

class Transform {
  public constructor() { }

}
