import p5 from "p5"
import { Vector } from "../../classes/physics"
import { random, toggleFullscreen } from "../../classes/utilities"
import { constants } from "../meta_generative_art_v2/constants"
import { log } from "../meta_generative_art_v2/functions"
import { Obj, Circle } from "../meta_generative_art_v2/objects"
import {
  SurfaceConstraint,
  FrictionConstraint,
  RepulsiveConstraint,
  AttractorConstraint,
  Rule,
} from "../meta_generative_art_v2/rules"

let t = 0
const canvasId = "canvas"
const rule = new Rule()
const allObjects: Obj[] = []
const firstObjects: Obj[] = []

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
        localObject.update()
        localObject.draw(p, obj.position)
      })
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
    const circle = new Circle(constants.system.fieldSize.randomized(), random(constants.simulation.maxSize, constants.simulation.minSize))
    const hasLocalObjects = random(1) < constants.draw.circle.filter
    circle.shouldDraw = false
    if (hasLocalObjects) {
      const numberOfLocalObjects = random(constants.simulation.numberOfChildren)
      for (let j = 0; j < numberOfLocalObjects; j += 1) {
        const localPosition = localObjectPositionArea.randomized()
        const localSize = random(constants.simulation.maxSize / 2, constants.simulation.minSize)
        const localObject = new Circle(localPosition, localSize)
        localObject.shouldDraw = true
        circle.localObjects.push(localObject)
        allObjects.push(localObject)
      }
    }
    firstObjects.push(circle)
    allObjects.push(circle)
  }
}
