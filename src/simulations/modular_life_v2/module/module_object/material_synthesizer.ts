import type { MaterialRecipeName } from "../../physics/material"
import type { MaterialSynthesizerInterface } from "../module"

export class MaterialSynthesizer implements MaterialSynthesizerInterface {
  public readonly case: "materialSynthesizer"

  public constructor(
    public readonly recipeName: MaterialRecipeName
  ) {
  }
}