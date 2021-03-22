import p5 from "p5"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("size", 1200, "s")

const debug = parameters.boolean("debug", true, "d")
const fullscreenEnabled = parameters.boolean("fullscreen", false, "f")
const constants = {
  numberOfObjects: parameters.int("number_of_objects", 100, "o"),
  minSize: parameters.float("size_min", 10, "min"),
  maxSize: parameters.float("size_max", 50, "max"),
  repulsiveForce: parameters.float("repulsive_force", 1, "fr"),
  surfaceRepulsiveForce: parameters.float("surface_repulsive_force", 1, "fs"),
  frictionForce: parameters.float("friction_force", 1, "ff"), // 0.0 ~ 1.0
  numberOfAttractors: parameters.int("number_of_attractors", 2, "a"),
  attractorMaxForce: parameters.float("attracter_max_force", 1, "fa"),
}
const drawParameters = {
  general: {
    debug: parameters.boolean("draw.debug", false, "d.d"),
    fade: parameters.float("draw.fade", 0, "d.f"), // 0.0 ~ 1.0
  },
  circle: {
    centerPoint: parameters.boolean("draw.center", false, "d.c"),
    filter: parameters.float("draw.filter", 1, "d.fi"),  // 0.0 ~ 1.0
  },
}

const fieldSize = fullscreenEnabled ? new Vector(window.screen.width, window.screen.height) : new Vector(fieldBaseSize, fieldBaseSize * 0.6)

function log(message: string) {
  if (debug) {
    console.log(message)
  }
}

let t = 0
const canvasId = "canvas"
const singleObjectConstraints: SingleObjectConstraint<Circle>[] = []  // TODO: Tを定義せずConstraint[]と書きたい
const multipleObjectConstraints: MultipleObjectConstraint<Circle>[] = []
const limits: Limit<Circle>[] = []
const allObjects: Obj[] = []

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    setupRules()
    setupObjects()

    p.background(0, 0xFF)
  }

  p.draw = () => {
    p.background(0, 0xFF * drawParameters.general.fade)

    for (let i = 0; i < (allObjects.length - 1); i += 1) {
      const anObject = allObjects[i]
      if (anObject instanceof Circle) {
        singleObjectConstraints.forEach(constraint => {
          constraint.update(anObject)
        })
      }

      for (let j = i + 1; j < allObjects.length; j += 1) {
        const other = allObjects[j]
        const distance = anObject.position.dist(other.position)
        if (anObject instanceof Circle && other instanceof Circle) {
          multipleObjectConstraints.forEach(constraint => {
            constraint.update(anObject, other, distance)
          })
        }
      }
    }

    allObjects.forEach(obj => {
      obj.update()
      limits.forEach(limit => {
        if (obj instanceof Circle) {
          limit.update(obj)
        }
      })

      obj.draw(p)
    })

    draw(singleObjectConstraints, p)
    draw(multipleObjectConstraints, p)
    draw(limits, p)

    t += 1
  }

  p.mousePressed = () => {
    if (fullscreenEnabled !== true) {
      return
    }
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen != undefined) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen != undefined) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen != undefined) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen != undefined) {
        document.msExitFullscreen()
      }
    } else {
      const canvas = document.getElementById(canvasId)
      if (canvas?.requestFullscreen !== undefined) {
        canvas.requestFullscreen()
      } else if (canvas?.mozRequestFullScreen !== undefined) {
        canvas.mozRequestFullScreen()
      } else if (canvas?.webkitRequestFullscreen !== undefined) {
        canvas.webkitRequestFullscreen() // (Element.ALLOW_KEYBOARD_INPUT)
      } else if (canvas?.msRequestFullscreen !== undefined) {
        canvas.msRequestFullscreen()
      }
    }
  }
}

export const getTimestamp = (): number => {
  return t
}

// --------------- //
function setupRules() {
  singleObjectConstraints.push(new SurfaceConstraint(constants.surfaceRepulsiveForce))
  singleObjectConstraints.push(new FrictionConstraint(Math.max(Math.min(constants.frictionForce, 1), 0)))
  multipleObjectConstraints.push(new RepulsiveConstraint(constants.repulsiveForce))
  // limits.push(new SurfaceLimit())
  setupAttractors()
}

function setupAttractors() {
  for (let i = 0; i < constants.numberOfAttractors; i += 1) {
    singleObjectConstraints.push(new AttractorConstraint(fieldSize.randomized(), random(constants.attractorMaxForce, 0.1)))
  }
}

function setupObjects() {
  for (let i = 0; i < constants.numberOfObjects; i += 1) {
    const circle = new Circle(fieldSize.randomized(), random(constants.maxSize, constants.minSize))
    circle.shouldDraw = random(1) < drawParameters.circle.filter
    allObjects.push(circle)
  }
}

// tslint:disable-next-line:no-any
function isDrawable(obj: any): obj is Drawable {
  return obj != undefined && obj.draw != undefined
}

// tslint:disable-next-line:no-any
function draw(rules: any[], p: p5) {
  if (drawParameters.general.debug === false) {
    return
  }
  rules.forEach(rule => {
    if (isDrawable(rule)) {
      rule.draw(p)
    }
  })
}

// --------------- //
interface Drawable {
  draw(p: p5): void
}

// Rule ⊃ Constraint, Rule ⊃ Limit
interface SingleObjectConstraint<T extends Obj> {
  update(anObject: T): void
}

interface MultipleObjectConstraint<T extends Obj> {
  update(anObject: T, other: T, distance: number): void
}

interface Limit<T extends Obj> {
  update(anObject: T): void
}

interface Obj extends Drawable {
  position: Vector
  velocity: Vector
  forces: Vector[]
  isCollided(other: Obj): boolean
  update(): void
}

class RepulsiveConstraint implements MultipleObjectConstraint<Circle> {
  private maxForceSize: number

  public constructor(public readonly force: number) {
    this.maxForceSize = force * 10
  }

  public update(anObject: Circle, other: Circle, distance: number): void {
    const minimumDistance = (anObject.size + other.size) / 2
    if (distance >= minimumDistance) {
      return
    }
    const forceSize = Math.min(Math.pow(minimumDistance / distance, 2) * this.force, this.maxForceSize)
    const totalMass = anObject.mass + other.mass
    anObject.forces.push(anObject.position.sub(other.position).sized(forceSize * other.mass / totalMass))
    other.forces.push(other.position.sub(anObject.position).sized(forceSize * anObject.mass / totalMass))
  }
}

class SurfaceConstraint implements SingleObjectConstraint<Circle> {
  private maxForceSize: number

  public constructor(public readonly force: number) {
    this.maxForceSize = force * 2
  }

  public update(anObject: Circle): void {
    // TODO: 力の方向をcanvasの中心に向ける
    let dx = 0
    let dy = 0
    if (anObject.position.x < 0) {
      dx = Math.min(Math.pow(anObject.position.x, 2) * this.force, this.maxForceSize)
    } else if (anObject.position.x > fieldSize.x) {
      dx = -Math.min(Math.pow(anObject.position.x - fieldSize.x, 2) * this.force, this.maxForceSize)
    }
    if (anObject.position.y < 0) {
      dy = Math.min(Math.pow(anObject.position.y, 2) * this.force, this.maxForceSize)
    } else if (anObject.position.y > fieldSize.y) {
      dy = -Math.min(Math.pow(anObject.position.y - fieldSize.y, 2) * this.force, this.maxForceSize)
    }

    if (dx === 0 && dy === 0) {
      return
    }
    anObject.forces.push(new Vector(dx, dy))
  }
}

class FrictionConstraint implements SingleObjectConstraint<Circle> {
  public constructor(public readonly friction: number) { }

  public update(anObject: Circle): void {
    anObject.velocity = anObject.velocity.mult(this.friction)
  }
}

class AttractorConstraint implements SingleObjectConstraint<Circle>, Drawable  {
  private maxForce: number

  public constructor(public readonly position: Vector, public readonly force: number) {
    this.maxForce = 1
  }

  public update(anObject: Circle): void {
    const distance = this.position.dist(anObject.position)
    const force = Math.min(Math.pow(Math.min(1 / distance, 0.1), 2) * this.force, this.maxForce)
    anObject.forces.push(this.position.sub(anObject.position).sized(force))
  }

  public draw(p: p5): void {
    const index = 5
    p.noStroke()
    p.fill(0xFF, 0xFF / index)
    this.drawRecursive(index, p)
  }

  private drawRecursive(index: number, p: p5) {
    if (index <= 0) {
      return
    }
    const size = Math.pow(index, 3) * this.force * 0.05
    p.circle(this.position.x, this.position.y, size)
    this.drawRecursive(index - 1, p)
  }
}

class SurfaceLimit implements Limit<Circle> {
  public update(anObject: Circle): void {
    const radius = anObject.size / 2
    const objectSize = new Vector(radius, radius)
    anObject.position = anObject.position.max(objectSize).min(fieldSize.sub(objectSize))
  }
}

class Circle implements Obj {
  public forces: Vector[] = []
  public velocity = Vector.zero()
  public mass: number
  public shouldDraw = true

  public constructor(public position: Vector, public size: number) {
    this.mass = Math.pow(size, 2)
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

  public update(): void {
    const force = this.forces.reduce(
      (result: Vector, current: Vector) => {
        return result.add(current)
      },
      Vector.zero(),
    )
    this.velocity = this.velocity.add(force)
    this.position = this.position.add(this.velocity)
    this.forces.splice(0, this.forces.length)
  }

  public draw(p: p5): void {
    if (drawParameters.general.debug) {
      p.noFill()
      p.stroke(0xFF, 0x7F)
      p.circle(this.position.x, this.position.y, this.size)
    }
    if (this.shouldDraw === false) {
      return
    }
    if (drawParameters.circle.centerPoint) {
      p.fill(0xFF, 0x7F)
      p.noStroke()
      p.circle(this.position.x, this.position.y, 4)
    }
  }
}
