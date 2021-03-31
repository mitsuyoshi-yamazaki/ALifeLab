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
  update(): void
}

export function canCollideWith(object1: Obj, object2: Obj): boolean {
  if (object1.localObjects.includes(object2) || object2.localObjects.includes(object1)) {
    return false
  }

  return object1.collisionTags.some(tag => object2.collisionTags.includes(tag))
}

export function isCollided(object1: Obj, object2: Obj): boolean {  // ※ 使用されていない
  if (canCollideWith(object1, object2) === false) {
    return false
  }

  const notImplementedError = (): void => {
    log(`${object1.constructor.name} and ${object2.constructor.name} collision not implemented`)
  }

  if (object1 instanceof Circle) {  // FixMe: もっと良い書き方があるはず
    if (object2 instanceof Circle) {
      return isCirclesCollided(object1, object2)
    } else if (object2 instanceof Wall) {
      return isWallAndCircleCollided(object2, object1)
    } else {
      notImplementedError()

      return false
    }
  } else if (object1 instanceof Wall) {
    if (object2 instanceof Circle) {
      return isWallAndCircleCollided(object1, object2)
    } else if (object2 instanceof Wall) {
      return false
    } else {
      notImplementedError()

      return false
    }
  } else {
    notImplementedError()

    return false
  }
}

function isCirclesCollided(circle1: Circle, circle2: Circle): boolean {
  const distance = circle1.position.dist(circle2.position)

  return distance <= (circle1.size + circle2.size) / 2
}

function isWallAndCircleCollided(wall: Wall, circle: Circle): boolean {
  const radius = circle.size / 2
  const halfWidth = wall.size.x / 2
  const halfHeight = wall.size.y / 2

  // FixMe: 角のrが考慮されていない
  if (circle.position.x < wall.position.x - halfWidth - radius) {
    return false
  } else if (circle.position.x > wall.position.x + halfWidth + radius) {
    return false
  } else if (circle.position.y < wall.position.y - halfHeight - radius) {
    return false
  } else if (circle.position.y > wall.position.y + halfHeight + radius) {
    return false
  }

  return true
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

export class Wall implements Obj {
  public localObjects: Obj[] = []
  public localRule: Rule | undefined = undefined

  public constructor(public readonly position: Vector, public readonly size: Vector, public collisionTags: CollisionTag[]) {
  }
  public get forces(): Vector[] {
    return []
  }
  public get velocity(): Vector {
    return Vector.zero()
  }

  public update(): void {
  }

  public draw(p: p5): void {
    p.noStroke()
    p.fill(0xFF, 0x30)
    p.rect(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y)
  }
}
