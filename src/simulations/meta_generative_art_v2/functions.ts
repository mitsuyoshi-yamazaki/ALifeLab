import { constants } from "./constants"

export function log(message: string): void {
  if (constants.system.debug) {
    console.log(message)
  }
}
