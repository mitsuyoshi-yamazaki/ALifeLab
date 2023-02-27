export type RedMaterial = "red"
export type GreenMaterial = "green"
export type BlueMaterial = "blue"
export type MaterialType = RedMaterial | GreenMaterial | BlueMaterial

export type Energy = "energy"
export type Heat = "heat"

export type IngredientType = MaterialType | Energy

type Amount = number
type ProductionSpec = {
  readonly amount: Amount
  /// 生産に必要な1tick当たりの必要量
  readonly ingredients: {[Ingredient in IngredientType]?: Amount}
  readonly time: number
}

export type MaterialProductionSpec = { [Material in MaterialType]: ProductionSpec }

export const defaultMaterialProductionSpec: MaterialProductionSpec = {
  red: {
    amount: 100,
    ingredients: {
      energy: 100,
    },
    time: 1,
  },
  green: {
    amount: 50,
    ingredients: {
      energy: 50,
    },
    time: 1,
  },
  blue: {
    amount: 10,
    ingredients: {
      energy: 10,
    },
    time: 1,
  },
}