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
export type MaterialAmountMap = { [Ingredient in SynthesizeType]?: Amount }
export type ProductionRecipe = {
  // readonly time: number  // 時間がかかると中間状態を保存する必要が出るためこのバージョンでは1tickで完了とする
  readonly heatProduction: number
  readonly ingredients: MaterialAmountMap
  readonly productions: MaterialAmountMap
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

export const getShortMaterialName = (materialType: TransferrableMaterialType): string => {
  switch (materialType) {
  case "energy":
    return "E"
  case "carbon":
    return "C"
  case "nitrogen":
    return "N"
  case "fuel":
    return "F"
  case "substance":
    return "S"
  default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = materialType
    throw new Error()
  }
  }
}