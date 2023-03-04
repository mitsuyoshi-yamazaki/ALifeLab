import type { TransferrableMaterialType } from "../../physics/material"
import type { ChannelInterface } from "../module"

export class Channel implements ChannelInterface {
  readonly case: "channel"
  readonly materialType: TransferrableMaterialType

  public constructor(
  ) {
  }
}