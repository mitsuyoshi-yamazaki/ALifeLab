import p5 from "p5"
import { Vector } from "../../classes/physics"
import { constants } from "./constants"
import { log } from "./functions"

export interface Drawable {
  draw(p: p5): void
}

// tslint:disable-next-line:no-any
export function isDrawable(obj: any): obj is Drawable {
  return obj != undefined && obj.draw != undefined
}

// tslint:disable-next-line:no-any
export function draw(rules: any[], p: p5) {
  if (constants.draw.general.debug === false) {
    return
  }
  rules.forEach(rule => {
    if (isDrawable(rule)) {
      rule.draw(p)
    }
  })
}

export interface Obj extends Drawable {
  position: Vector
  velocity: Vector
  forces: Vector[]
  isCollided(other: Obj): boolean
  update(): void
}

export class Circle implements Obj {
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
    if (constants.draw.general.debug) {
      p.noFill()
      p.stroke(0xFF, 0x7F)
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
