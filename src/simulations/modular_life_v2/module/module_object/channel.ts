import type { TransferrableMaterialType } from "../../physics/material"
import { ChannelInterface } from "../module"
import { AbstractModule } from "./abstract_module"

export class Channel extends AbstractModule<"channel"> implements ChannelInterface {
  public readonly case = "channel"

  public constructor(
    public readonly materialType: TransferrableMaterialType,
  ) {
    super()
  }
}