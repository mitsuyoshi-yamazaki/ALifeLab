import type { Result } from "../../classes/result"
import type { Direction, NeighbourDirection } from "./direction"
import type { EnergySource } from "./energy_source"
import type { ModuleType } from "./module/types"
import type { LifeSpec, WorldObject } from "./types"

export type LookAroundResult = { [K in Direction]: WorldObject[] }

export type ComputerApi = {
  /// 生命がもつモジュールの一覧を返す
  connectedModules(): ModuleType[]

  /// 生命を隣接するセルに動かす
  move(direction: NeighbourDirection): Result<void, string>

  /// 現在位置を含む周囲に存在するオブジェクトを返す
  lookAround(): LookAroundResult

  /// 対象のEnergySourceからエネルギーを採掘する
  harvest(energySource: EnergySource): Result<number, string>

  /// 新たな生命を生成
  assemble(spec: LifeSpec): Result<void, string> // TODO: 複数のAssemblerに対応する

  /// 生成した生命を世界に放つ
  release(): Result<void, string> // TODO: 複数のAssemblerに対応する
}
