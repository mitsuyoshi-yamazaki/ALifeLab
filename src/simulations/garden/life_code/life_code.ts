import { LifeApi } from "../api/api"
import { ResourceStore } from "../resource_store"

export type LifeStatus = {
  readonly resourceStore: ResourceStore
}

export interface LifeCode {
  run(status: LifeStatus, api: LifeApi): void
}