import { Vector } from "../../../classes/physics"

export const isNearTo = (position1: Vector, position2: Vector): boolean => {
  return position1.dist(position2) <= 1
}

export type StringConvertible = {
  toString(): string
}