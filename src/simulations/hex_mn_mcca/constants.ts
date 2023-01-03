import { URLParameterParser } from "../../classes/url_parameter_parser_v2"

const parameters = new URLParameterParser(document.location.search)

export const constants = {
  system: {
    debug: parameters.parseBoolean("debug", "d"),
    debugValue: parameters.parseFloat("debug_value") ?? 1,
  },
  simulation: {
    cellSize: parameters.parseInt("cell_size", "si.c") ?? 12,
    worldSize: parameters.parseInt("world_size", "si.w") ?? 720,
    calculationSpeed: parameters.parseInt("calculation_speed", "si.s") ?? 1,
  },
  parameters: {
  },
}

const constantsDescription: string[] = [
  "constants: ",
  ...Array.from(Object.values(constants)).flatMap((constantGroup): string[] => {
    return Array.from(Object.entries(constantGroup)).map(([key, value]) => `${key}: ${value}`)
  })
]
console.log(constantsDescription.join("\n"))