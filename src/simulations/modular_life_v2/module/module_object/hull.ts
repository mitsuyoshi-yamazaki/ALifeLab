import type { MaterialStore, ScopeId, ScopeUpdate } from "../../physics/scope"
import type { HullInterface } from "../module"

export class Hull implements HullInterface {
  public readonly case: "hull"

  public hits = 0
  public readonly hitsMax: number
  public readonly size: number
  // public readonly internalModules: { [M in InternalModuleType]: Module<M>[] } // HullはScope.hullに入っている

  public readonly scopeId: ScopeId
  public readonly amount: MaterialStore
  public readonly capacity: number
  public heat: number

  public readonly hull: Hull[]

  public scopeUpdate: ScopeUpdate | null

  public constructor(
  ) {
  }
}