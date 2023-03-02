export type Nitrogen = "nitrogen"
export type Carbon = "carbon"

/// エネルギーを安定して保存できる
export type Fuel = "fuel"

/// すべてのModuleの原料
export type Substance = "substance"
export type MaterialType = Nitrogen | Carbon | Fuel | Substance

export type Energy = "energy"
export type Heat = "heat"

export type TransferrableMaterialType = MaterialType | Energy
export type SynthesizeType = MaterialType | Energy

type Amount = number
export type ProductionRecipe = {
  // readonly time: number  // 時間がかかると中間状態を保存する必要が出るためこのバージョンでは1tickで完了とする
  readonly heatProduction: number
  readonly ingredients: { [Ingredient in SynthesizeType]?: Amount }
  readonly productions: { [Production in SynthesizeType]?: Amount }
}

export type MaterialRecipeName = "composeFuel" | "decomposeFuel"
export const materialProductionRecipes: { [RecipeName in MaterialRecipeName]: ProductionRecipe } = {
  composeFuel: {
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
  decomposeFuel: {
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
}
