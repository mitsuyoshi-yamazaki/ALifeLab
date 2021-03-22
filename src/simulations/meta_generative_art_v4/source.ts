import p5 from "p5"
import { random, toggleFullscreen } from "../../classes/utilities"
import { constants } from "../meta_generative_art_v2/constants"
import { log } from "../meta_generative_art_v2/functions"
import { Obj, Circle, draw } from "../meta_generative_art_v2/objects"
import {
  SingleObjectConstraint,
  MultipleObjectConstraint,
  Limit,
  SurfaceConstraint,
  FrictionConstraint,
  RepulsiveConstraint,
  AttractorConstraint,
} from "../meta_generative_art_v2/rules"

let t = 0
const canvasId = "canvas"
const singleObjectConstraints: SingleObjectConstraint<Circle>[] = []  // TODO: Tを定義せずConstraint[]と書きたい
const multipleObjectConstraints: MultipleObjectConstraint<Circle>[] = []
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
  singleObjectConstraints.push(new SurfaceConstraint(constants.simulation.surfaceRepulsiveForce))
  singleObjectConstraints.push(new FrictionConstraint(Math.max(Math.min(constants.simulation.frictionForce, 1), 0)))
  multipleObjectConstraints.push(new RepulsiveConstraint(constants.simulation.repulsiveForce))
  // limits.push(new SurfaceLimit())
  setupAttractors()
}

function setupAttractors() {
  for (let i = 0; i < constants.simulation.numberOfAttractors; i += 1) {
    const position = constants.system.fieldSize.randomized()
    const force = random(constants.simulation.attractorMaxForce, 0.1)
    singleObjectConstraints.push(new AttractorConstraint(position, force))
  }
}

function setupObjects() {
  for (let i = 0; i < constants.simulation.numberOfObjects; i += 1) {
    const circle = new Circle(constants.system.fieldSize.randomized(), random(constants.simulation.maxSize, constants.simulation.minSize))
    circle.shouldDraw = random(1) < constants.draw.circle.filter
    allObjects.push(circle)
  }
}
