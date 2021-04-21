import { Color } from "../../classes/color"

export const defaultInitialCondition = "A"

export type LSystemCondition = string | number
export interface LSystemCoordinate {
  condition: string
  direction: number
}

export interface LSystemRule {
  encoded: string
  possibleConditions: string[]
  nextConditions(currentCondition: string): LSystemCondition[]
  nextCoordinates(condition: string, direction: number): LSystemCoordinate[]
  colorOfCondition?(condition: string): Color
}