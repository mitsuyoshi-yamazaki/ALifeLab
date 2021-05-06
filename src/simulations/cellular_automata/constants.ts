import { URLParameterParser } from "../../classes/url_parameter_parser"
import { InitialStateType, isInitialStateType } from "./initial_state_type"

const parameters = new URLParameterParser()

const parseInitialState = (): InitialStateType => {
  const defaultValue = "line"
  const rawValue = parameters.string("simulation.initial_state", defaultValue, "s.is")
  if (isInitialStateType(rawValue)) {
    return rawValue
  }
  return defaultValue
}

// 指定できるURLパラメータの一覧
// parameters.boolean/int/float/string("パラメータ名", 指定されない場合のデフォルト値, "パラメータ名省略記法")
export const constants = {
  // システム全体に関わる設定
  system: {
    // Canvasサイズ
    fieldSize: parameters.int("system.size", 600, "s"),
  },

  // シミュレーション系に関する設定
  simulation: {
    // 実行間隔
    executionInterval: parameters.int("simulation.execution_interval", 1, "s.ei"),

    // セルの大きさ
    cellSize: parameters.float("simulation.cell_size", 10, "s.cs"),

    // 近傍半径
    radius: parameters.int("simulation.radius", 1, "s.r"),

    // ルールを指定する
    presetRule: parameters.string("simulation.automaton_rule", "", "s.ar"),

    // 初期状態を指定する
    // see: initial_state_type.ts
    initialState: parseInitialState(),
  },

  // 描画に関する設定
  draw: {

  },
}