import { Vector } from "../../classes/physics"
import { URLParameterParser } from "../../classes/url_parameter_parser"

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("system.size", 600, "s")

export const constants = {
  system: {
    fieldSize: new Vector(fieldBaseSize, fieldBaseSize * 0.6),
    run: parameters.boolean("system.run", false, "r"),
  },
  simulation: {
    executionInteral: parameters.int("simulation.execution_interval", 1, "s.i"),
    maxDrawerCount: parameters.int("simulation.max_drawer_count", 100, "s.d"),
    lineCollisionEnabled: parameters.boolean("simulation.line_collision_enabled", true, "s.c"),
    lSystemRule: parameters.string("simulation.lsystem_rule", "A:-30,A,60,B;B:A", "s.l"),
  },
  draw: {
    showsBorderLine: parameters.boolean("draw.shows_border_line", false, "d.b"),
  },
}

// http://localhost:8080/pages/drawer.html?r=1&s.i=5&s.d=400
