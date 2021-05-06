import { URLParameterParser } from "../../classes/url_parameter_parser"
import { constants as originalConstants } from "../hex_cellular_automata/constants"

const parameters = new URLParameterParser()

// 指定できるURLパラメータの一覧
// parameters.boolean/int/float/string("パラメータ名", 指定されない場合のデフォルト値, "パラメータ名省略記法")
export const constants = {
  // システム全体に関わる設定
  system: {
    ...originalConstants.system
  },

  // シミュレーション系に関する設定
  simulation: {
    ...originalConstants.simulation
  },

  // 自動探索に関する設定
  autosearch: {

  },

  // 描画に関する設定
  draw: {
    ...originalConstants.draw
  },
}