import type { Result } from "../../../classes/result"
import type { Direction, NeighbourDirection } from "../primitive/direction"
import type { ModuleType } from "./types"
import type { WorldObject } from "../primitive/world_object_interface"
import type { LifeSpec } from "./module_spec"

export type LookAroundResult = { [K in Direction]: WorldObject[] }

export type ComputerApi = {
  /// エネルギー量
  energyAmount: number

  /// 熱量
  heat: number

  /// 周囲の環境の熱量
  environmentalHeat(): {[D in Direction]: number}

  /// 生命がもつモジュールの一覧を返す
  connectedModules(): ModuleType[]

  /// 生命を隣接するセルに動かす
  move(direction: NeighbourDirection): Result<void, string>

  /// 現在位置からエネルギーを回収する
  harvest(): Result<number, string>

  /// 新たな生命を生成
  assemble(spec: LifeSpec): Result<void, string> // TODO: 複数のAssemblerに対応する

  /// assemblingをもっているAssembleがあるかどうか
  isAssembling(): boolean

  /// 生成した生命を世界に放つ
  release(): Result<void, string> // TODO: 複数のAssemblerに対応する
}
