import { ModuleInterface } from "../module/module"
import { InternalModuleType } from "../module/module_object/module_object"
import { SourceCode } from "../module/source_code"
import { AncestorSpec } from "./spawner"

export const Ancestor = {
  /// 生命として成立する最小の祖先種
  minimum(code: SourceCode): AncestorSpec {
    throw "not implemented"
    // /*
    // - 計算機 x 1
    // - 外殻 x 1
    // - 推進器 x 1
    //  */

    // const computer: ComputerInterface = {
    //   case: "computer",
    //   code,
    // }
    // const mover: MoverInterface = {
    //   case: "mover",
    // }

    // return {
    //   case: "hull",
    //   hits: 0,
    //   hitsMax: 1000,
    //   size: 4,
    //   internalModules: {
    //     computer: [computer],
    //     assembler: [],
    //     channel: [],
    //     mover: [mover],
    //     materialSynthesizer: [],
    //   },
    //   ...createScopeData("Life", 1000),
    // }
  },

  /// 試験用
  test(code: SourceCode): AncestorSpec {
    const internalModules: ModuleInterface<InternalModuleType>[] = [
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
