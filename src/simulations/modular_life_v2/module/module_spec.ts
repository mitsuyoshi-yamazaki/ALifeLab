import type { SynthesizeType } from "../physics/material"
import { ModuleType } from "./module"

type ModuleIngredients = { [M in SynthesizeType]?: number }

const moduleIngredients: { [M in ModuleType]: ModuleIngredients } = {
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
    mover: {},
    materialSynthesizer: {},
  },
}
