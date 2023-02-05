import { Direction } from "../direction"
import { Environment } from "../environment"
import { AnyModule, isHull } from "../module"
import { Module } from "../module/module"
import { logFailure } from "../result"

export const createStillCode = (): Module.SourceCode => {
  return () => {
    console.log("still code")
  }
}

export const createMoveCode = (direction: Direction): Module.SourceCode => {
  return (modules: AnyModule[], environment: Environment) => {
    if (environment.time % 10 !== 0) {
      return
    }

    const hull = modules.find(isHull)
    if (hull == null) {
      return
    }

    logFailure(hull.move(direction))
  }
}