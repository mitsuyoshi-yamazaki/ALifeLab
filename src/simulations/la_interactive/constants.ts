import { URLParameterParser } from "../../classes/url_parameter_parser"

const parameters = new URLParameterParser()

// 指定できるURLパラメータの一覧
// parameters.boolean/int/float/string("パラメータ名", 指定されない場合のデフォルト値, "パラメータ名省略記法")
export const constants = {
  fullscreen: parameters.boolean("fullscreen", false, undefined),
  fieldSize: parameters.int("size", 600, undefined),
  rules: parameters.string("rules", "", undefined),
}