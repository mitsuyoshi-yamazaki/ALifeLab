import { URLParameterParser } from "../../classes/url_parameter_parser"

const parameters = new URLParameterParser()

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

    // オブジェクトの配置間隔（角度）
    objectSpacing: parameters.float("simulation.object_spacing", 60, "s.os"),
  },

  // 描画に関する設定
  draw: {
  },
}