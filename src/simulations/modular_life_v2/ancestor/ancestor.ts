import { Computer, Hull } from "../module/module"
import { SourceCode } from "../module/source_code"
import { createScopeData } from "../physics/scope"

/// 生命として成立する最小の祖先種
export const createMinimumAncestor = (code: SourceCode): Hull => {  // TODO:
  /*
  - 計算機 x 1
  - 外殻 x 1
  - 推進器 x 1  // TODO:
   */

  const computer: Computer = {
    case: "computer",
    code,
  }

  return {
    case: "hull",
    hits: 0,
    hitsMax: 1000,
    size: 4,
    internalModules: {
      computer: [computer],
      assembler: [],
    },
    ...createScopeData(1000),
  }
}

/// 自己複製できる最小の祖先種
export const createMinimumSelfReproductionAncestor = (code: SourceCode): Hull => {  // TODO:
  /*
  - 計算機 x 1
  - 物質輸送口 x 1
  - 外殻 x n
  - 推進器 x 1
  - 物質変換器 x n
  - 組み立て機 x 1
  */
  throw "not implemented"
}

/// 自身より複雑な子孫を組み立てられる祖先種
export const createGeneralAssemblerAncestor = (code: SourceCode): Hull => {  // TODO:
  throw "not implemented"
}
