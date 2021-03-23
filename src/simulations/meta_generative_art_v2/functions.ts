import { constants } from "./constants"

export function log(message: string) {
  if (constants.system.debug) {
    console.log(message)
  }
}
