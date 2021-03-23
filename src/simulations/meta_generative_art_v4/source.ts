import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random, toggleFullscreen } from "../../classes/utilities"
import { constants } from "../meta_generative_art_v2/constants"
import { log } from "../meta_generative_art_v2/functions"
import { Obj, CollisionTag, Circle } from "../meta_generative_art_v2/objects"
import {
  SurfaceConstraint,
  FrictionConstraint,
  RepulsiveConstraint,
  AttractorConstraint,
  ReverseAttractorConstraint,
  Rule,
} from "../meta_generative_art_v2/rules"

let t = 0
const canvasId = "canvas"
const rule = new Rule()
const allObjects: Obj[] = []
const firstObjects: Obj[] = []
const collisionTags: CollisionTag[] = ["0"]

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

    if (t % constants.simulation.surpriseInterval === 0) {
      const pickableObjects = firstObjects.filter(o => o.localObjects.length === 0)
      for (let i = 0; i < 3; i += 1) {
        const obj = pickableObjects[Math.floor(random(pickableObjects.length))]
        obj.position = constants.system.fieldSize.randomized()
      }
    }

    const firstLevelSingleConstraints = rule.singleObjectConstraints.filter(constraint => constraint.isFirstLevelConstraint)
    const allLevelSingleConstraints = rule.singleObjectConstraints.filter(constraint => constraint.isFirstLevelConstraint === false)
    for (let i = 0; i < (allObjects.length - 1); i += 1) {
      const anObject = allObjects[i]
      if (anObject instanceof Circle) {
        allLevelSingleConstraints.forEach(constraint => {
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
          const minDistance = (anObject.size + other.size) / 2
          if (constants.draw.general.line && distance <= minDistance) {
            p.noFill()
            const color = ((minDistance - distance) / minDistance) * 0xFF
            p.stroke(color, 0xFF)
            p.strokeWeight(0.5)
            p.line(anObject.position.x, anObject.position.y, other.position.x, other.position.y)
          }
        }
      }
    }

    firstObjects.forEach(obj => {
      if (obj instanceof Circle) {
        firstLevelSingleConstraints.forEach(constraint => {
          constraint.update(obj)
        })
      }
      obj.update()

      obj.draw(p)
      obj.localObjects.forEach(localObject => {
        if (localObject instanceof Circle && obj.localRule != undefined) {
          obj.localRule.singleObjectConstraints.forEach(constraint => { // TODO: 必要ならmultipleObjectConstraintsの適用
            constraint.update(localObject)
          })
        }
        localObject.update()
        localObject.draw(p)
      })
    })

    rule.draw(p)

    t += 1
  }

  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > constants.system.fieldSize.x || p.mouseY < 0 || p.mouseY > constants.system.fieldSize.y) {
      return
    }
    if (constants.system.fullscreenEnabled) {
      toggleFullscreen(canvasId)  // TODO: フルスクリーンは他のアクションで行うようにする
    } else {
      const circle = new Circle(new Vector(p.mouseX, p.mouseY), constants.simulation.maxSize, collisionTags)
      circle.shouldDraw = false
      allObjects.push(circle)
      firstObjects.push(circle)
    }
  }
}

export const getTimestamp = (): number => {
  return t
}

// ------ Setup ------ //
function setupRules() {
  rule.singleObjectConstraints.push(new SurfaceConstraint(constants.simulation.surfaceRepulsiveForce))
  rule.singleObjectConstraints.push(new FrictionConstraint(Math.max(Math.min(constants.simulation.frictionForce, 1), 0)))
  rule.multipleObjectConstraints.push(new RepulsiveConstraint(constants.simulation.repulsiveForce))
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
  const localObjectPositionArea = new Vector(constants.simulation.maxSize * 2, constants.simulation.maxSize * 2)
  for (let i = 0; i < constants.simulation.numberOfObjects; i += 1) {
    const position = constants.system.fieldSize.randomized()
    const size = random(constants.simulation.maxSize, constants.simulation.minSize)
    const circle = new Circle(position, size, collisionTags)
    circle.shouldDraw = false
    const hasLocalObjects = random(1) < constants.draw.circle.filter
    const numberOfLocalObjects = random(constants.simulation.numberOfChildren)
    if (hasLocalObjects && numberOfLocalObjects > 0) {
      const localRule = new Rule()
      const localAttractor = new ReverseAttractorConstraint(circle, circle.mass * constants.simulation.localAttracterForce)
      localRule.singleObjectConstraints.push(localAttractor)
      circle.localRule = localRule
      for (let j = 0; j < numberOfLocalObjects; j += 1) {
        const localPosition = localObjectPositionArea.randomized().add(circle.position)
        const localSize = random(constants.simulation.maxSize, constants.simulation.minSize)
        const localObject = new Circle(localPosition, localSize, collisionTags)
        localObject.shouldDraw = true
        circle.localObjects.push(localObject)
        allObjects.push(localObject)
      }
    }
    firstObjects.push(circle)
    allObjects.push(circle)
  }
}
