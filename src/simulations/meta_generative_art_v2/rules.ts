import p5 from "p5"
import { Vector } from "../../classes/physics"
import { constants } from "./constants"
import { Drawable, Obj, Circle } from "./objects"

// Rule ⊃ Constraint, Rule ⊃ Limit
export class Rule implements Drawable {
  public singleObjectConstraints: SingleObjectConstraint<Circle>[] = []  // TODO: Tを定義せずConstraint[]と書きたい
  public multipleObjectConstraints: MultipleObjectConstraint<Circle>[] = []
  public limits: Limit<Circle>[] = []

  public draw(p: p5) {
    this.drawRules(this.singleObjectConstraints, p)
    this.drawRules(this.multipleObjectConstraints, p)
    this.drawRules(this.limits, p)
  }

  // tslint:disable-next-line:no-any
  private isDrawable(obj: any): obj is Drawable {
    return obj != undefined && obj.draw != undefined
  }

  // tslint:disable-next-line:no-any
  private drawRules(rules: any[], p: p5) {
    if (constants.draw.general.debug === false) {
      return
    }
    rules.forEach(rule => {
      if (this.isDrawable(rule)) {
        rule.draw(p)
      }
    })
  }
}

export interface SingleObjectConstraint<T extends Obj> {
  isFirstLevelConstraint: boolean
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
    if (anObject.canCollideWith(other) === false) {
      return
    }
    const forceSize = Math.min(Math.pow(minimumDistance / distance, 2) * this.force, this.maxForceSize)
    const totalMass = anObject.mass + other.mass
    anObject.forces.push(anObject.position.sub(other.position).sized(forceSize * other.mass / totalMass))
    other.forces.push(other.position.sub(anObject.position).sized(forceSize * anObject.mass / totalMass))
  }
}

export class SurfaceConstraint implements SingleObjectConstraint<Circle> {
  public isFirstLevelConstraint = true
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
  public isFirstLevelConstraint = false
  public constructor(public readonly friction: number) { }

  public update(anObject: Circle): void {
    anObject.velocity = anObject.velocity.mult(this.friction)
  }
}

export class AttractorConstraint implements SingleObjectConstraint<Circle>, Drawable {
  public isFirstLevelConstraint = true
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
    if (constants.draw.general.line) {
      return
    }
    const index = 25
    p.noStroke()
    p.fill(0xFF, 0x7F / index)
    this.drawRecursive(index, p)
  }

  private drawRecursive(index: number, p: p5) {
    if (index <= 0) {
      return
    }
    const size = Math.pow(index, 3) * this.force * 0.0002
    p.circle(this.position.x, this.position.y, size)
    this.drawRecursive(index - 1, p)
  }
}

export class ReverseAttractorConstraint implements SingleObjectConstraint<Circle> {
  public isFirstLevelConstraint = false
  private maxForce: number

  public constructor(private origin: Circle, public readonly force: number) {
    this.maxForce = 1
  }

  public update(anObject: Circle): void {
    const distance = this.origin.position.dist(anObject.position)
    const force = Math.min(Math.pow(distance / 100, 2) * this.force, this.maxForce)
    const reactionForce = Math.min(distance / 1000 * this.force, this.maxForce / 10)
    anObject.forces.push(this.origin.position.sub(anObject.position).sized(force))
    this.origin.forces.push(anObject.position.sub(this.origin.position).sized(reactionForce))
  }
}

export class SurfaceLimit implements Limit<Circle> {
  public update(anObject: Circle): void {
    const radius = anObject.size / 2
    const objectSize = new Vector(radius, radius)
    anObject.position = anObject.position.max(objectSize).min(constants.system.fieldSize.sub(objectSize))
  }
}
