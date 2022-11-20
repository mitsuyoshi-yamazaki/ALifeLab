import { URLParameterParser } from "../../classes/url_parameter_parser"

const parameters = new URLParameterParser()

export const constants = {
  system: {
    debug: parameters.boolean("debug", false, "d"),
  },
}
