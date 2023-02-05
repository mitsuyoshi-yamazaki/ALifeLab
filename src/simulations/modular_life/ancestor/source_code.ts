import { Direction } from "../direction"
import { AnyModule, isHull } from "../module"
import { Module } from "../module/module"
import { logFailure } from "../result"

export const createStillCode = (): Module.SourceCode => {
  return () => {
    console.log("still code")
  }
}

export const createMoveCode = (direction: Direction): Module.SourceCode => {
  return (modules: AnyModule[]) => {
    const hull = modules.find(isHull)
    if (hull == null) {
      return
    }

    logFailure(hull.move(direction))
  }
}