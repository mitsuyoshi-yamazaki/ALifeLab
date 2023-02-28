export type Nitrogen = "nitrogen"
export type Carbon = "carbon"

/// エネルギーを安定して保存できる
export type Fuel = "fuel"

/// すべてのModuleの原料
export type Substance = "substance"
export type MaterialType = Nitrogen | Carbon | Fuel | Substance

export type Energy = "energy"
export type Heat = "heat"

export type SynthesizeType = MaterialType | Energy

type Amount = number
export type ProductionRecipe = {
  readonly name: string
  readonly time: number
  readonly heatProduction: number
  readonly ingredients: { [Ingredient in SynthesizeType]?: Amount }
  readonly productions: { [Production in SynthesizeType]?: Amount }
}

const recipes: ProductionRecipe[] = [
  {
    name: "compose-fuel",
    time: 1,
    heatProduction: 1,
    ingredients: {
      nitrogen: 1,
      carbon: 1,
      energy: 12,
    },
    productions: {
      fuel: 1,
    },
  },
  {
    name: "decompose-fuel",
    time: 1,
    heatProduction: 1,
    ingredients: {
      fuel: 1,
    },
    productions: {
      nitrogen: 1,
      carbon: 1,
      energy: 10,
    },
  },
]

export const materialProductionRecipes = new Map<string, ProductionRecipe>(recipes.map(x => [x.name, x]))
