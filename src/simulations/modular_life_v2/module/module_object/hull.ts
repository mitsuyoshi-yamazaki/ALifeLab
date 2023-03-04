import { createMaterialStore, createScopeId, createScopeUpdate, MaterialStore, ScopeUpdate } from "../../physics/scope"
import { HullInterface } from "../module"
import { AbstractModule } from "./abstract_module"
import type { InternalModuleType, Module } from "./module_object"

export class Hull extends AbstractModule<"hull"> implements HullInterface {
  public readonly case: "hull"

  public hits = 0
  public readonly hitsMax: number
  public readonly internalModules: { [M in InternalModuleType]: {[Id: string]: Module<M>} } = { // HullはScope.hullに入っている
    computer: {},
    assembler: {},
    channel: {},
    mover: {},
    materialSynthesizer: {},
  }

  public readonly scopeId = createScopeId("Life")
  public readonly amount: MaterialStore = createMaterialStore()
  public readonly capacity: number
  public heat = 0

  public readonly hull: Hull[] = []

  public scopeUpdate: ScopeUpdate

  public constructor(
    public readonly size: number,
  ) {
    super()

    this.hitsMax = Math.pow(size, 2) * 100
    this.capacity = Math.pow(size, 2) * 100

    this.scopeUpdate = createScopeUpdate(this)
  }

  public addInternalModule<M extends InternalModuleType>(module: Module<M>): void {
    this.internalModules[module.case][module.id] = module
    // (this.internalModules[module.case] as Module<M>[]).push(module)
  }
}