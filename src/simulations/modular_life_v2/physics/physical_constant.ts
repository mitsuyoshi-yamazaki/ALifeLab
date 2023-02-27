export type RedMaterial = "red"
export type GreenMaterial = "green"
export type BlueMaterial = "blue"
export type MaterialType = RedMaterial | GreenMaterial | BlueMaterial

export type Energy = "energy"
export type Heat = "heat"

export type IngredientType = MaterialType | Energy

type Amount = number
type ProductionSpec = {
  /// 1単位の生産に必要な1tick当たりの必要量
  readonly ingredients: [IngredientType, Amount][]
  readonly time: number
}

export type PhysicalConstant = {
  readonly heatLossRate: number
  readonly energyHeatConversionRate: number

  // readonly materialProduction: { [Material in MaterialType]: ProductionSpec }  // TODO:
}