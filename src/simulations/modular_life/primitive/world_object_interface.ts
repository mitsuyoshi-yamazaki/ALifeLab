export type WorldObjectType = "life" | "energy_source"

type WorldObjectInterface<T extends WorldObjectType> = {
  readonly case: T
  readonly id: number
}

export type EnergySourceInterface = {
  readonly energyAmount: number
  readonly production: number
  readonly capacity: number
} & WorldObjectInterface<"energy_source">

export type LifeInterface = {
  // TODO:
} & WorldObjectInterface<"life">

export type WorldObject = EnergySourceInterface | LifeInterface