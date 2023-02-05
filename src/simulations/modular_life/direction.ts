import { Vector } from "../../classes/physics"

export const Directions = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
} as const

export type Direction = keyof typeof Directions

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
  }
}