import { ModuleDefinition } from "../module/module"
import { InternalModuleType } from "../module/module_object/module_object"
import { SourceCode } from "../module/source_code"
import { AncestorSpec } from "./spawner"

export const Ancestor = {
  /// 生命として成立する最小の祖先種
  minimum(code: SourceCode): AncestorSpec {
    const internalModules: ModuleDefinition<InternalModuleType>[] = [
      {
        case: "computer",
        code,
      },
      {
        case: "channel",
        materialType: "energy",
      },
      { case: "mover" },
    ]

    return {
      hullSize: 4,
      internalModules,
    }
  },

  /// 試験用
  test(code: SourceCode): AncestorSpec {
    const internalModules: ModuleDefinition<InternalModuleType>[] = [
      {
        case: "computer",
        code,
      },
      { case: "mover" },
      { case: "mover" },
      { case: "mover" },
    ]

    return {
      hullSize: 4,
      internalModules,
    }
  },


  /// 自己複製できる最小の祖先種
  minimumSelfReproduction(code: SourceCode): AncestorSpec {  // TODO:
    /*
    - 計算機 x 1
    - 物質輸送口 x 1
    - 外殻 x n
    - 推進器 x 1
    - 物質変換器 x n
    - 組み立て機 x 1
    */
    throw "not implemented"
  },

  /// 自身より複雑な子孫を組み立てられる祖先種
  generalAssembler(code: SourceCode): AncestorSpec {  // TODO:
    throw "not implemented"
  },
  
}
