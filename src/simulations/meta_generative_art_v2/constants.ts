import { URLParameterParser } from "../../classes/url_parameter_parser"
import { Vector } from "../../classes/physics"

/*
http://localhost:8080/pages/meta_generative_art_v4.html?s=1200&o=50&a=2&c=4&si=200&fr=0.5&fs=0.1&ff=0.993&fa=100&fl=0.00005&d.d=0&d.f=0.1&d.c=1&d.fi=0.5&d.l=0
 */

const parameters = new URLParameterParser()

const debug = parameters.boolean("draw.debug", false, "d.d")
const fullscreenEnabled = parameters.boolean("fullscreen", false, "f")
const fieldBaseSize = parameters.int("size", 1200, "s")

export const constants = {
  system: {
    debug: parameters.boolean("debug", true, "d"),
    fullscreenEnabled,
    fieldSize: fullscreenEnabled ?
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
    numberOfChildren: parameters.float("number_of_children", 3, "c"),
    localAttracterForce: parameters.float("local_attracter_force", 0.1, "fl"),
    surpriseInterval: parameters.float("surprise_interval", 200, "si"),
  },
  draw: {
    general: {
      debug,

      /// 0.0(no refresh) ~ 1.0(refresh every tick), disabled while draw.general.debug == true
      fade: debug ? 1 : parameters.float("draw.fade", 1, "d.f"),
      line: parameters.boolean("draw.line", false, "d.l"),
    },
    circle: {
      centerPoint: parameters.boolean("draw.center", false, "d.c"),
      filter: parameters.float("draw.filter", 0.3, "d.fi"),  // 0.0 ~ 1.0
      hasChild: parameters.float("draw.child", 0.1, "d.ch"),  // 0.0 ~ 1.0
    },
  },
}
