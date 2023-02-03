import { LifeApi } from "../api/api"
import { LifeCode, LifeStatus } from "../life_code/life_code"
import { ResourceStore } from "../resource_store"

export class Life implements LifeStatus {
  public readonly resourceStore = new ResourceStore()

  public constructor(
    private readonly code: LifeCode,
  ) {
  }

  public run(api: LifeApi): void {
    this.code.run(this, api)
  }
}