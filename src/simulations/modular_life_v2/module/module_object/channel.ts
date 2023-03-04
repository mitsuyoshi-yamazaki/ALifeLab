import type { TransferrableMaterialType } from "../../physics/material"
import type { ChannelInterface } from "../module"

export class Channel implements ChannelInterface {
  public readonly case: "channel"

  public constructor(
    public readonly materialType: TransferrableMaterialType,
  ) {
  }
}