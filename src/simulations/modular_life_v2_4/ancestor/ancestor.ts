import { ModuleDefinition } from "../module/module"
import { InternalModuleType } from "../module/module_object/module_object"
import { SourceCode } from "../module/source_code"
import { AncestorSpec } from "./spawner"

export const Ancestor = {
  /// 試験用
  test(codeBase: () => SourceCode): AncestorSpec {
    const internalModules: ModuleDefinition<InternalModuleType>[] = [
      {
        case: "computer",
        codeBase,
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

  /// 生命として成立する最小の祖先種
  minimum(codeBase: () => SourceCode): AncestorSpec {
    const internalModules: ModuleDefinition<InternalModuleType>[] = [
      {
        case: "computer",
        codeBase,
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

  /// 自己複製できる最小の祖先種
  minimumSelfReproduction(codeBase: () => SourceCode): AncestorSpec {
    const internalModules: ModuleDefinition<InternalModuleType>[] = [
      {
        case: "computer",
        codeBase,
      },
      { case: "assembler" },
      {
        case: "channel",
        materialType: "energy",
      },
      {
        case: "channel",
        materialType: "energy",
      },
      {
        case: "channel",
        materialType: "substance",
      },
      { case: "mover" },
    ]

    return {
      hullSize: 4,
      internalModules,
    }
  },

  /// 自身より複雑な子孫を組み立てられる祖先種
  generalAssembler(codeBase: () => SourceCode): AncestorSpec {
    throw "not implemented"  // TODO:
  },
}
