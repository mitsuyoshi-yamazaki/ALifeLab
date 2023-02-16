import type { Result } from "../../../classes/result"
import type { Direction, NeighbourDirection } from "../primitive/direction"
import type { ModuleType } from "./types"
import type { EnergySourceInterface, WorldObject } from "../primitive/world_object_interface"
import type { LifeSpec } from "./module_spec"

export type LookAroundResult = { [K in Direction]: WorldObject[] }

export type ComputerApi = {
  /// エネルギー量
  energyAmount: number

  /// 生命がもつモジュールの一覧を返す
  connectedModules(): ModuleType[]

  /// assemblingをもっているAssembleがあるかどうか
  isAssembling(): boolean

  /// 生命を隣接するセルに動かす
  move(direction: NeighbourDirection): Result<void, string>

  /// 現在位置を含む周囲に存在するオブジェクトを返す
  lookAround(): LookAroundResult

  /// 対象のEnergySourceからエネルギーを回収する
  harvest(energySource: EnergySourceInterface): Result<number, string>

  /// 新たな生命を生成
  assemble(spec: LifeSpec): Result<void, string> // TODO: 複数のAssemblerに対応する

  /// 生成した生命を世界に放つ
  release(): Result<void, string> // TODO: 複数のAssemblerに対応する
}
