import { Vector } from "../../classes/physics"

export const NeighbourDirections = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
} as const

export type NeighbourDirection = keyof typeof NeighbourDirections
export type Direction = NeighbourDirection | "center"

export const getDirectionVector = (direction: Direction): Vector => {
  switch (direction) {
  case "top":
    return new Vector(0, -1)
  case "bottom":
    return new Vector(0, 1)
  case "left":
    return new Vector(-1, 0)
  case "right":
    return new Vector(1, 0)
  case "center":
    return Vector.zero()
  }
}