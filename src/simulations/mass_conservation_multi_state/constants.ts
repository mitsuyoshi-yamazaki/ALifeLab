import { URLParameterParser } from "../../classes/url_parameter_parser_v2"

const parameters = new URLParameterParser(document.location.search)

export const constants = {
  system: {
    debug: parameters.parseBoolean("debug", "d"),
  },
  simulation: {
    cellSize: parameters.parseInt("cell_size", "si.c") ?? 4,
    worldSize: parameters.parseInt("world_size", "si.w") ?? 200,
    autoDownload: parameters.parseInt("download_interval", "si.d"),
  },
  parameters: {
    sameSubstancePressureMultiplier: parameters.parseFloat("same_substance_pressure_multiplier", "p.p1") ?? 1,
    differentSubstancePressureMultiplier: parameters.parseFloat("different_substance_pressure_multiplier", "p.p2") ?? 1,
    densityPressureMultiplier: parameters.parseFloat("density_pressure_multiplier", "p.p3") ?? 1,
  },
}

const constantsDescription: string[] = [
  "constants: ",
  ...Array.from(Object.values(constants)).flatMap((constantGroup): string[] => {
    return Array.from(Object.entries(constantGroup)).map(([key, value]) => `${key}: ${value}`)
  })
]
console.log(constantsDescription.join("\n"))