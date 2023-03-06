import { createModuleId, ModuleId, ModuleType } from "../module"

export abstract class AbstractModule<M extends ModuleType> {
  public abstract readonly case: M
  public readonly id: ModuleId<M> = createModuleId()
}