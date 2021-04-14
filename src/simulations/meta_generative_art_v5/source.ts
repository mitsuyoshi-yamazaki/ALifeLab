import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random, toggleFullscreen } from "../../classes/utilities"
import { constants } from "../meta_generative_art_v2/constants"
import { log } from "../meta_generative_art_v2/functions"
import { Obj, Circle, Wall, CollisionTag } from "../meta_generative_art_v2/objects"
import {
  Rule,
  Limit,
  SurfaceConstraint,
  FrictionConstraint,
  RepulsiveConstraint,
  AttractorConstraint,
  WallConstraint,
  MultipleObjectConstraint,
} from "../meta_generative_art_v2/rules"

let t = 0
const canvasId = "canvas"
const rule = new Rule()
const objectConstraints: MultipleObjectConstraint<Obj>[] = []
const allObjects: Obj[] = []

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(constants.system.fieldSize.x, constants.system.fieldSize.y)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    setupRules()
    setupObjects()

    p.background(0, 0xFF)
  }

  p.draw = () => {
    p.background(0, 0xFF * constants.draw.general.fade)

    for (let i = 0; i < (allObjects.length - 1); i += 1) {
      const anObject = allObjects[i]
      if (anObject instanceof Circle) {
        rule.singleObjectConstraints.forEach(constraint => {
          constraint.update(anObject)
        })
      }

      for (let j = i + 1; j < allObjects.length; j += 1) {
        const other = allObjects[j]
        const distance = anObject.position.dist(other.position)
        if (anObject instanceof Circle && other instanceof Circle) {
          rule.multipleObjectConstraints.forEach(constraint => {
            constraint.update(anObject, other, distance)
          })
        } else {
          objectConstraints.forEach(constraint => {
            constraint.update(anObject, other, distance)
          })
        }
      }
    }

    allObjects.forEach(obj => {
      obj.update()
      obj.draw(p)
    })

    rule.draw(p)

    t += 1
  }

  p.mousePressed = () => {
    if (constants.system.fullscreenEnabled !== true) {
      return
    }
    toggleFullscreen(canvasId)
  }
}

export const getTimestamp = (): number => {
  return t
}

// --------------- //
function setupRules() {
  rule.singleObjectConstraints.push(new SurfaceConstraint(constants.simulation.surfaceRepulsiveForce))
  rule.singleObjectConstraints.push(new FrictionConstraint(Math.max(Math.min(constants.simulation.frictionForce, 1), 0)))
  rule.multipleObjectConstraints.push(new RepulsiveConstraint(constants.simulation.repulsiveForce))
  objectConstraints.push(new WallConstraint(constants.simulation.wallRepulsiveForce))
  // limits.push(new SurfaceLimit())
  setupAttractors()
}

function setupAttractors() {
  for (let i = 0; i < constants.simulation.numberOfAttractors; i += 1) {
    const position = constants.system.fieldSize.randomized()
    const force = random(constants.simulation.attractorMaxForce, 0.1)
    rule.singleObjectConstraints.push(new AttractorConstraint(position, force))
  }
}

function setupObjects() {
  const fieldSize = constants.system.fieldSize
  const defaultCollisionTag: CollisionTag = "0"
  const visibleObjectCollisionTag: CollisionTag = "1"

  for (let i = 0; i < constants.simulation.numberOfObjects; i += 1) {
    const position = fieldSize.randomized()
    const size = random(constants.simulation.maxSize, constants.simulation.minSize)
    const isVisible = random(1) < constants.draw.circle.filter
    const collisionTags: CollisionTag[] = [defaultCollisionTag]
    if (isVisible) {
      collisionTags.push(visibleObjectCollisionTag)
    }
    const circle = new Circle(position, size, collisionTags)
    circle.shouldDraw = isVisible
    allObjects.push(circle)
  }

  const wallCollisionTags: CollisionTag[] = [visibleObjectCollisionTag]
  const wallBaseSizeVector = fieldSize.mult(0.2)
  const wallBaseSize = Math.max(wallBaseSizeVector.x, wallBaseSizeVector.y)
  const wallMaxSize = new Vector(wallBaseSize, wallBaseSize)

  for (let i = 0; i < constants.simulation.numberOfWalls; i += 1) {
    const position = fieldSize.randomized()
    const size = wallMaxSize.randomized()
    const wall = new Wall(position, size, wallCollisionTags)
    allObjects.push(wall)
  }
}
