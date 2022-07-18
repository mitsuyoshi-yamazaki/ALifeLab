import { Vector } from "../../classes/physics"

export type Circle = {
  readonly case: "circle"
  diameter: number
}
export type Rectangle = {
  readonly case: "rectangle"
  width: number
  height: number
  angle: number
}
export type Line = {
  readonly case: "line"
  length: number
  angle: number
}
export type Shape = Circle | Rectangle | Line

export type Atom = {
  position: Vector
  shape: Shape
}
