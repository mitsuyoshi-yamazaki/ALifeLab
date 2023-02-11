import type { Result } from "../../classes/result"
import type { Module } from "./module/module"

// ModuleからWorldを呼び出すdelegate
// 循環参照を避けるために設置している
// プレイヤーが触るComputer以外のモジュールが呼び出す
export type WorldDelegate = {
  addLife(hull: Module.Hull): Result<void, string>
}

export const worldDelegate = {
  delegate: null as WorldDelegate | null
}