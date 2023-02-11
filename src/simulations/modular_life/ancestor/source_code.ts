import { Direction } from "../direction"
import { ComputeArgument } from "../module"
import { Module } from "../module/module"
import { logFailure } from "../result"

export const createStillCode = (): Module.SourceCode => {
  return () => {
    console.log("still code")
  }
}

export const createMoveCode = (direction: Direction): Module.SourceCode => {
  return ([api, environment]: ComputeArgument) => {
    if (environment.time % 10 !== 0) {
      return
    }

    logFailure(api.move(direction))
  }
}