import { URLParameterParser } from "../../classes/url_parameter_parser"
import { BinaryRule } from "./rule"
import { InitialState, isInitialState } from "./initial_state"

const parameters = new URLParameterParser()

const parseRule = (): BinaryRule => {
  const rawRule = parameters.string("simulation.rule", "random", "s.r")
  if (rawRule === "random") {
    return BinaryRule.random()
  }
  try {
    return new BinaryRule(rawRule)
  } catch (error) {
    alert(`無効なルールです (${error})`)
    throw error
  }
}

const parseInitialState = (): InitialState => {
  const defaultValue = "line"
  const rawValue = parameters.string("simulation.initial_state", defaultValue, "s.is")
  if (isInitialState(rawValue)) {
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

    // ルール: ランダム or 指定
    // - ランダム: "random"
    // - ルールを指定(例): "a:2,3;s:3"
    rule: parseRule(),

    // 初期状態: ランダム or aliveセルひとつ or aliveセル1行
    // - ランダム: "random"
    // - aliveセルひとつ: "one"
    // - aliveセル1行: "line"
    initialState: parseInitialState(),
  },

  // 描画に関する設定
  draw: {

  },
}