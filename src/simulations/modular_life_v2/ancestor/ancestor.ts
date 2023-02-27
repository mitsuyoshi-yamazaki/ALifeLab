import { Computer, Hull, Mover } from "../module/module"
import { SourceCode } from "../module/source_code"
import { createScopeData } from "../physics/scope"

export const Ancestor = {
  /// 生命として成立する最小の祖先種
  minimum(code: SourceCode): Hull {
    /*
    - 計算機 x 1
    - 外殻 x 1
    - 推進器 x 1
     */

    const computer: Computer = {
      case: "computer",
      code,
    }
    const mover: Mover = {
      case: "mover",
    }

    return {
      case: "hull",
      hits: 0,
      hitsMax: 1000,
      size: 4,
      internalModules: {
        computer: [computer],
        assembler: [],
        channel: [],
        mover: [mover],
        materialSynthesizer: [],
      },
      ...createScopeData(1000),
    }
  },

  /// 試験用
  test(code: SourceCode): Hull {
    return {
      case: "hull",
      hits: 0,
      hitsMax: 1000,
      size: 3,
      internalModules: {
        computer: [],
        assembler: [],
        channel: [{ case: "channel" }, { case: "channel" }, { case: "channel" }, { case: "channel" }],
        mover: [{ case: "mover" }, { case: "mover" }, { case: "mover" }, { case: "mover" }],
        materialSynthesizer: [],
      },
      ...createScopeData(1000),
    }
  },


  /// 自己複製できる最小の祖先種
  minimumSelfReproduction(code: SourceCode): Hull {  // TODO:
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
  generalAssembler(code: SourceCode): Hull {  // TODO:
    throw "not implemented"
  },
  
}
