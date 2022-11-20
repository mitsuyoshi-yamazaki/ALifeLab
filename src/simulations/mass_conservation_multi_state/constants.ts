import { URLParameterParser } from "../../classes/url_parameter_parser"

const parameters = new URLParameterParser()

export const constants = {
  system: {
    debug: parameters.boolean("debug", false, "d"),
  },
  simulation: {
    cellSize: parameters.int("cell_size", 4, "si.c"),
    worldSize: parameters.int("world_size", 200, "si.w"),
  }
}
