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
    // セルの大きさ
    cellSize: parameters.float("simulation.cell_size", 10, "s.cs"),    

    // 初期状態: ランダム or ルール
    // - ランダム: "random"
    // - ルールを指定する場合: "" // TODO:
    initialState: parameters.string("simulation.initial_state", "random", "s.is")
  },

  // 描画に関する設定
  draw: {

  },
}