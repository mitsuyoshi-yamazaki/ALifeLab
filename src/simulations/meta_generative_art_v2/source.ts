import p5 from "p5"
import { random, toggleFullscreen } from "../../classes/utilities"
import { constants } from "./constants"
import { log } from "./functions"
import { Obj, Circle, CollisionTag } from "./objects"
import {
Rule,
  Limit,
  SurfaceConstraint,
  FrictionConstraint,
  RepulsiveConstraint,
  AttractorConstraint,
} from "./rules"

let t = 0
const canvasId = "canvas"
const rule = new Rule()
const limits: Limit<Circle>[] = []
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
  const collisionTags: CollisionTag[] = ["0"]
  for (let i = 0; i < constants.simulation.numberOfObjects; i += 1) {
    const position = constants.system.fieldSize.randomized()
    const size = random(constants.simulation.maxSize, constants.simulation.minSize)
    const circle = new Circle(position, size, collisionTags)
    circle.shouldDraw = random(1) < constants.draw.circle.filter
    allObjects.push(circle)
  }
}
