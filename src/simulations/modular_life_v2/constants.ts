import { URLParameterParser } from "../../classes/url_parameter_parser_v3"
import { isLogLevel, LogLevel } from "./logger"
import { materialProductionRecipes } from "./physics/material"
import type { PhysicalConstant } from "./physics/physical_constant"

const parameters = new URLParameterParser(document.location.search)

const logLevel: LogLevel = parameters.parseTypedString("log_level", "LogLevel", isLogLevel) ?? "warning"

const physicalConstant: PhysicalConstant = {
  heatLossRate: parameters.parseFloat("heat_loss", { alternativeKey: "ph.h", min: 0 }) ?? 0.25,
  energyHeatConversionRate: parameters.parseFloat("energy_heat_conversion", { alternativeKey: "ph.e", min: 0 }) ?? 0.5,
  heatDamage: parameters.parseFloat("heat_damage", { alternativeKey: "ph.d", min: 0 }) ?? 0.1,

  materialProductionRecipe: materialProductionRecipes,
}

export const constants = {
  system: {
    debug: parameters.parseBoolean("debug", { alternativeKey: "d" }),
    logLevel,
  },
  simulation: {
    cellSize: parameters.parseInt("cell_size", { alternativeKey: "si.c", min: 1 }) ?? 16,
    worldSize: parameters.parseInt("world_size", { alternativeKey: "si.w", min: 4 }) ?? 40,
    frameSkip: parameters.parseInt("frame_skip", { alternativeKey: "si.f", min: 1 }) ?? 2,
    substanceAmount: parameters.parseInt("substance_amount", { min: 1 }) ?? 500
  },
  physicalConstant,
}

const constantsDescription: string[] = [
  "constants: ",
  ...Array.from(Object.values(constants)).flatMap((constantGroup): string[] => {
    return Array.from(Object.entries(constantGroup)).map(([key, value]) => `${key}: ${value}`)
  })
]
console.log(constantsDescription.join("\n"))