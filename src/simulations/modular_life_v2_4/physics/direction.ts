import { Vector } from "../../../classes/physics"

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

export const clockwiseDirection = (direction: NeighbourDirection): NeighbourDirection => {
  switch (direction) {
  case "top":
    return NeighbourDirections.right
  case "bottom":
    return NeighbourDirections.left
  case "left":
    return NeighbourDirections.top
  case "right":
    return NeighbourDirections.bottom
  }
}

export const counterClockwiseDirection = (direction: NeighbourDirection): NeighbourDirection => {
  switch (direction) {
  case "top":
    return NeighbourDirections.left
  case "bottom":
    return NeighbourDirections.right
  case "left":
    return NeighbourDirections.bottom
  case "right":
    return NeighbourDirections.top
  }
}

export const oppositeDirection = (direction: NeighbourDirection): NeighbourDirection => {
  switch (direction) {
  case "top":
    return NeighbourDirections.bottom
  case "bottom":
    return NeighbourDirections.top
  case "left":
    return NeighbourDirections.right
  case "right":
    return NeighbourDirections.left
  }
}
