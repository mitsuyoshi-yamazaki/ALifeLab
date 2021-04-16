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
    maxLineCount: parameters.int("simulation.max_line_count", 5000, "s.l"),
    lineCollisionEnabled: parameters.boolean("simulation.line_collision_enabled", true, "s.c"),
    lSystemRule: parameters.string("simulation.lsystem_rule", "A:-30,A,60,B;B:A", "s.r"),
    mutationRate: parameters.float("simulation.mutation_rate", 0, "s.m"),
    numberOfSeeds: parameters.int("simulation.number_of_seeds", 3, "s.s"),
  },
  draw: {
    showsBorderLine: parameters.boolean("draw.shows_border_line", false, "d.b"),
  },
}
