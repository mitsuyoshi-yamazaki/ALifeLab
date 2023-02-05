import { Result } from "../../classes/result"
import { Direction } from "./direction"
import { Module } from "./module/module"


// ModuleからWorldを呼び出すdelegate
// APIを準備したら不要になる
export type WorldDelegate = {
  addLife(hull: Module.Hull): Result<void, string>
  move(hull: Module.Hull, direction: Direction): Result<void, string>
}

export const worldDelegate = {
  delegate: null as WorldDelegate | null
}