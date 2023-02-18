import { URLParameterParser } from "../../classes/url_parameter_parser_v3"
import { isLogLevel, LogLevel } from "./logger"

const parameters = new URLParameterParser(document.location.search)

const logLevel: LogLevel = parameters.parseTypedString("log_level", "LogLevel", isLogLevel) ?? "warning"

export const constants = {
  system: {
    debug: parameters.parseBoolean("debug", { alternativeKey: "d" }),
    logLevel,
  },
  simulation: {
    cellSize: parameters.parseInt("cell_size", { alternativeKey: "si.c", min: 1 }) ?? 8,
    worldSize: parameters.parseInt("world_size", { alternativeKey: "si.w", min: 4 }) ?? 50,
    frameSkip: parameters.parseInt("frame_skip", { alternativeKey: "si.f", min: 1 }) ?? 2,
  },
  physics: {
    heatLoss: parameters.parseFloat("heat_loss", { alternativeKey: "ph.h", min: 0 }) ?? 0.25,
    energyHeatConversion: parameters.parseFloat("energy_heat_conversion", { alternativeKey: "ph.e", min: 0 }) ?? 0.5,
    heatDamageRatio: parameters.parseFloat("heat_damage", { alternativeKey: "ph.d", min: 0 }) ?? 0.1,
  },
}

const constantsDescription: string[] = [
  "constants: ",
  ...Array.from(Object.values(constants)).flatMap((constantGroup): string[] => {
    return Array.from(Object.entries(constantGroup)).map(([key, value]) => `${key}: ${value}`)
  })
]
console.log(constantsDescription.join("\n"))