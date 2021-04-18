import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { exampleRules } from "./rule_examples"

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("system.size", 600, "s")
const defaultRule = exampleRules[Math.floor(random(exampleRules.length))]

export const constants = {
  system: {
    fieldSize: new Vector(fieldBaseSize, fieldBaseSize * 0.6),
    run: parameters.boolean("system.run", false, "r"),
    quadtreeEnabled: parameters.boolean("system.quadtree", true, "q"),
  },
  simulation: {
    executionInteral: parameters.int("simulation.execution_interval", 1, "s.i"),
    maxLineCount: parameters.int("simulation.max_line_count", 5000, "s.l"),
    lineCollisionEnabled: parameters.boolean("simulation.line_collision_enabled", true, "s.c"),
    lSystemRule: parameters.string("simulation.lsystem_rule", defaultRule, "s.r"),
    mutationRate: parameters.float("simulation.mutation_rate", 0, "s.m"),
    numberOfSeeds: parameters.int("simulation.number_of_seeds", 3, "s.s"),
    lineLifeSpan: parameters.int("simulation.line_life_span", 0, "s.ls"),
    lineLengthType: parameters.int("simulation.line_line_length_type", 0, "s.ll"),
  },
  draw: {
    showsBorderLine: parameters.boolean("draw.shows_border_line", false, "d.b"),
    showsQuadtree: parameters.boolean("draw.shows_quadtree", false, "d.q"),
  },
}
