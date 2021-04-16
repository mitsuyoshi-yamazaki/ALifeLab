import { Vector } from "../../classes/physics"
import { URLParameterParser } from "../../classes/url_parameter_parser"

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("system.size", 600, "s.s")

export const constants = {
  system: {
    fieldSize: new Vector(fieldBaseSize, fieldBaseSize * 0.6),
  },
  simulation: {
    maxDrawerCount: parameters.int("simulation.max_drawer_count", 100, "s.d"),
    lineCollisionEnabled: parameters.boolean("simulation.line_collision_enabled", true, "s.l"),
  },
  draw: {
    showsBorderLine: parameters.boolean("draw.shows_border_line", false, "d.b"),
  },
}
