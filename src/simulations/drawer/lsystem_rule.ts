export type LSystemCondition = string | number
export interface LSystemCoordinate {
  condition: string
  direction: number
}

export interface LSystemRule {
  possibleConditions: string[]
  nextConditions(currentCondition: string): LSystemCondition[]
  nextCoordinates(condition: string, direction: number): LSystemCoordinate[]
}