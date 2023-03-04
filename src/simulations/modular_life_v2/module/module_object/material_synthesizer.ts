import type { MaterialRecipeName } from "../../physics/material"
import { MaterialSynthesizerInterface } from "../module"
import { AbstractModule } from "./abstract_module"

export class MaterialSynthesizer extends AbstractModule<"materialSynthesizer"> implements MaterialSynthesizerInterface {
  public readonly case: "materialSynthesizer"

  public constructor(
    public readonly recipeName: MaterialRecipeName
  ) {
    super()
  }
}