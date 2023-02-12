import type { Environment } from "../primitive/environment"
import type { ComputerApi } from "./api"

export type SourceCode = ([api, environment]: ComputeArgument) => void

export type ComputeArgument = [ComputerApi, Environment]
