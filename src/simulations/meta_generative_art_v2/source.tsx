import p5 from "p5"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("size", 1200, "s")

const debug = parameters.boolean("debug", true, "d")
const constants = {
  numberOfObjects: parameters.int("number_of_objects", 100, "o"),
  minSize: parameters.float("size_min", 10, "min"),
  maxSize: parameters.float("size_max", 50, "max"),
}

const fieldSize = new Vector(fieldBaseSize, fieldBaseSize * 0.6)

function log(message: string) {
  if (debug) {
    console.log(message)
  }
}

const constraints: Constraint<Circle>[] = []
const allObjects: Obj[] = []

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    setupConstraints()
    setupObjects()

    p.background(0, 0xFF)
  }

  p.draw = () => {
    p.background(0, 0xFF)

    for (let i = 0; i < (allObjects.length - 1); i += 1) {
      const anObject = allObjects[i]
      for (let j = i + 1; j < allObjects.length; j += 1) {
        const other = allObjects[j]
        const distance = anObject.position.dist(other.position)
        if (anObject instanceof Circle && other instanceof Circle) {
          constraints.forEach(constraint => {
            constraint.update(anObject, other, distance)
          })
        }
      }
    }

    allObjects.forEach(obj => {
      const force = obj.forces.reduce(
        (result: Vector, current: Vector) => {
        return result.add(current)
        },
        Vector.zero(),
      )
      obj.velocity = obj.velocity.add(force)
      obj.position = obj.position.add(obj.velocity)
      obj.forces.splice(0, obj.forces.length)

      obj.draw(p)
    })
  }
}

// --------------- //
function setupConstraints() {
  constraints.push(new RepulsiveConstraint(1))
}

function setupObjects() {
  for (let i = 0; i < constants.numberOfObjects; i += 1) {
    const circle = new Circle(fieldSize.randomized(), random(constants.maxSize, constants.minSize))
    allObjects.push(circle)
  }
}

// --------------- //
interface Constraint<T extends Obj> {
  update(anObject: T, other: T, distance: number): void
}

interface Obj {
  position: Vector
  velocity: Vector
  forces: Vector[]
  isCollided(other: Obj): boolean
  draw(p: p5): void
}

class RepulsiveConstraint implements Constraint<Circle> {
  private maxForceSize: number

  public constructor(public readonly force: number) {
    this.maxForceSize = force * 10
  }

  public update(anObject: Circle, other: Circle, distance: number): void {
    const minimumDistance = (anObject.size + other.size) / 2
    if (distance < minimumDistance) {
      return
    }
    const forceSize = Math.min(Math.pow(minimumDistance / distance, 2) * this.force, this.maxForceSize)
    anObject.forces.push(anObject.position.sub(other.position).sized(forceSize))
    other.forces.push(other.position.sub(anObject.position).sized(forceSize))
  }
}

class Circle implements Obj {
  public forces: Vector[] = []
  public velocity = Vector.zero()

  public constructor(public position: Vector, public size: number) {
  }

  public isCollided(other: Obj): boolean {
    if (other instanceof Circle) {
      const distance = this.position.dist(other.position)

      return distance <= (this.size + other.size) / 2
    } else {
      log(`Circle and ${other.constructor.name} collision not implemented`)

      return false
    }
  }

  public draw(p: p5): void {
    p.noFill()
    p.stroke(0xFF, 0x7F)
    p.circle(this.position.x, this.position.y, this.size)
  }
}
