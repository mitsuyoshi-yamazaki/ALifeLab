import p5 from "p5"
import { Vector } from "../../classes/physics"
import { constants } from "./constants"
import { log } from "./functions"
import { Rule } from "./rules"

export interface Drawable {
  draw(p: p5): void
}

export type CollisionTag = string

export interface Obj extends Drawable {
  position: Vector
  forces: Vector[]
  velocity: Vector
  collisionTags: CollisionTag[]
  localObjects: Obj[]
  localRule: Rule | undefined
  isCollided(other: Obj): boolean
  update(): void
}

export class Circle implements Obj {
  public forces: Vector[] = []
  public velocity = Vector.zero()
  public localObjects: Obj[] = []
  public localRule: Rule | undefined
  public mass: number
  public shouldDraw = true

  public constructor(public position: Vector, public size: number, public collisionTags: CollisionTag[]) {
    this.mass = Math.pow(size, 2)
  }

  public canCollideWith(other: Obj): boolean {
    if (this.localObjects.includes(other) || other.localObjects.includes(this)) {
      return false
    }

    return this.collisionTags.some(tag => other.collisionTags.includes(tag))
  }

  public isCollided(other: Obj): boolean {  // ※ 使用されていない
    if (this.canCollideWith(other) === false) {
      return false
    }
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
    if (constants.draw.general.line) {
      return
    }
    if (constants.draw.general.debug) {
      p.noFill()
      if (this.localObjects.length > 0) {
        p.stroke(0xFF, 0x80, 0x80, 0x5F)
      } else {
        p.stroke(0xFF, 0x5F)
      }
      p.circle(this.position.x, this.position.y, this.size)
    }
    if (this.shouldDraw === false) {
      return
    }
    if (constants.draw.circle.centerPoint) {
      p.fill(0xFF, 0x7F)
      p.noStroke()
      p.circle(this.position.x, this.position.y, 4)
    }
  }
}
