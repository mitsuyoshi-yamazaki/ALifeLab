import { URLParameterParser } from "../../classes/url_parameter_parser"

const parameters = new URLParameterParser()

// 指定できるURLパラメータの一覧
// parameters.boolean/int/float/string("パラメータ名", 指定されない場合のデフォルト値, "パラメータ名省略記法")
export const constants = {
  system: {
    // Canvasサイズ
    fieldSize: parameters.int("system.size", 600, "s"),
  },
  simulation: {
    // 動作を遅くしたい場合に増やす。1未満の値（高速化）は動作しない
    executionInterval: parameters.int("simulation.execution_interval", 1, "s.i"),
  },
  draw: {
    // 1で四分木のノードを描画
    showsQuadtree: parameters.boolean("draw.shows_quadtree", false, "d.q"),
  },
}
