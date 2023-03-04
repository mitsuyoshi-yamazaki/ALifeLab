import { Life } from "../api_request"
import { ModuleDefinition } from "../module/module"
import { Hull } from "../module/module_object/hull"
import { createModule, InternalModuleType } from "../module/module_object/module_object"

export type AncestorSpec = {
  readonly hullSize: number
  readonly internalModules: ModuleDefinition<InternalModuleType>[]
}

/// 祖先種をSpawnさせる万能Assembler
/// 要件上、世界の法則に従いつつ無からエネルギーと物質を獲得する
export class Spawner {
  public constructor(
  ) {
  }

  // TODO: コード的に生成するのではなくEngine上の操作にのせる
  public createLife(spec: AncestorSpec): Life {
    const hull = new Hull(spec.hullSize)

    spec.internalModules.forEach(moduleDefinition => {
      hull.addInternalModule(createModule<InternalModuleType>(moduleDefinition))
    })
    
    return hull
  }
}