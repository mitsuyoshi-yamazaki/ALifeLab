import p5 from "p5"
import { Vector } from "../../classes/physics"
import { constants } from "./constants"
import { Drawable, Obj, Circle } from "./objects"

// Rule ⊃ Constraint, Rule ⊃ Limit
export interface SingleObjectConstraint<T extends Obj> {
  update(anObject: T): void
}

export interface MultipleObjectConstraint<T extends Obj> {
  update(anObject: T, other: T, distance: number): void
}

export interface Limit<T extends Obj> {
  update(anObject: T): void
}

export class RepulsiveConstraint implements MultipleObjectConstraint<Circle> {
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

export class SurfaceConstraint implements SingleObjectConstraint<Circle> {
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
    } else if (anObject.position.x > constants.system.fieldSize.x) {
      dx = -Math.min(Math.pow(anObject.position.x - constants.system.fieldSize.x, 2) * this.force, this.maxForceSize)
    }
    if (anObject.position.y < 0) {
      dy = Math.min(Math.pow(anObject.position.y, 2) * this.force, this.maxForceSize)
    } else if (anObject.position.y > constants.system.fieldSize.y) {
      dy = -Math.min(Math.pow(anObject.position.y - constants.system.fieldSize.y, 2) * this.force, this.maxForceSize)
    }

    if (dx === 0 && dy === 0) {
      return
    }
    anObject.forces.push(new Vector(dx, dy))
  }
}

export class FrictionConstraint implements SingleObjectConstraint<Circle> {
  public constructor(public readonly friction: number) { }

  public update(anObject: Circle): void {
    anObject.velocity = anObject.velocity.mult(this.friction)
  }
}

export class AttractorConstraint implements SingleObjectConstraint<Circle>, Drawable {
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

export class SurfaceLimit implements Limit<Circle> {
  public update(anObject: Circle): void {
    const radius = anObject.size / 2
    const objectSize = new Vector(radius, radius)
    anObject.position = anObject.position.max(objectSize).min(constants.system.fieldSize.sub(objectSize))
  }
}
