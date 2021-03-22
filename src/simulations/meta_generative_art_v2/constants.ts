import { URLParameterParser } from "../../classes/url_parameter_parser"
import { Vector } from "../../classes/physics"

const parameters = new URLParameterParser()

const fullscreenEnabledFlag = parameters.boolean("fullscreen", false, "f")
const fieldBaseSize = parameters.int("size", 1200, "s")

export const constants = {
  system: {
    debug: parameters.boolean("debug", true, "d"),
    fullscreenEnabled: fullscreenEnabledFlag,
    fieldSize: fullscreenEnabledFlag ?
      new Vector(window.screen.width, window.screen.height) : new Vector(fieldBaseSize, fieldBaseSize * 0.6),
  },
  simulation: {
    numberOfObjects: parameters.int("number_of_objects", 100, "o"),
    minSize: parameters.float("size_min", 10, "min"),
    maxSize: parameters.float("size_max", 50, "max"),
    repulsiveForce: parameters.float("repulsive_force", 1, "fr"),
    surfaceRepulsiveForce: parameters.float("surface_repulsive_force", 1, "fs"),
    frictionForce: parameters.float("friction_force", 1, "ff"), // 0.0 ~ 1.0
    numberOfAttractors: parameters.int("number_of_attractors", 2, "a"),
    attractorMaxForce: parameters.float("attracter_max_force", 1, "fa"),
  },
  draw: {
    general: {
      debug: parameters.boolean("draw.debug", false, "d.d"),
      fade: parameters.float("draw.fade", 0, "d.f"), // 0.0 ~ 1.0
    },
    circle: {
      centerPoint: parameters.boolean("draw.center", false, "d.c"),
      filter: parameters.float("draw.filter", 1, "d.fi"),  // 0.0 ~ 1.0
    },
  },
}