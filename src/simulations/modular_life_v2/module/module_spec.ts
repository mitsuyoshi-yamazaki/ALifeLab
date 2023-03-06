import type { MaterialAmountMap } from "../physics/material"
import type { ModuleType } from "./module"

const moduleIngredients: { [M in ModuleType]: MaterialAmountMap } = {
  hull: { substance: 10 },  // 1単位あたり
  computer: { substance: 5 },
  assembler: { substance: 200 },
  channel: { substance: 10 },
  mover: { substance: 100 },
  materialSynthesizer: { substance: 100 },
}

export const ModuleSpec = {
  moduleIngredients,
  modules: {
    hull: {},
    computer: {},
    assembler: {},
    channel: {
      /// 1tickあたり移動できる最大量
      maxTransferAmount: 10,
    },
    mover: {
      /// 重さあたり重量: 排熱量は消費エネルギーから求める
      energyConsumption: 0.01,
    },
    materialSynthesizer: {},
  },
}
