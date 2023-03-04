import type { MaterialRecipeName } from "../../physics/material"
import type { MaterialSynthesizerInterface } from "../module"

export class MaterialSynthesizer implements MaterialSynthesizerInterface {
  readonly case: "materialSynthesizer"
  readonly recipeName: MaterialRecipeName

  public constructor(
  ) {
  }
}