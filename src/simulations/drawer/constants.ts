import { random } from "../../classes/utilities"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { exampleRules } from "./rule_examples"

const parameters = new URLParameterParser()

const defaultRule = exampleRules[Math.floor(random(exampleRules.length))]

// 指定できるURLパラメータの一覧
// parameters.boolean/int/float/string("パラメータ名", 指定されない場合のデフォルト値, "パラメータ名省略記法")
export const constants = {
  system: {
    // Canvasサイズ
    fieldSize: parameters.int("system.size", 600, "s"),

    // trueで綺麗そうな絵になるルールを自動探索 
    run: parameters.boolean("system.run", false, "r"),

    // system.run=trueの場合、trueで有望なルールと画像を自動的にダウンロード
    autoDownload: parameters.boolean("system.auto_download", false, "d"),

    // trueで四分木による計算量削減を有効化
    quadtreeEnabled: parameters.boolean("system.quadtree", true, "q"),
  },
  simulation: {
    // 動作を遅くしたい場合に増やす。1未満の値（高速化）は動作しない
    executionInterval: parameters.int("simulation.execution_interval", 1, "s.i"),

    // 描画する線分の上限
    maxLineCount: parameters.int("simulation.max_line_count", 5000, "s.l"),

    // trueで線分の衝突判定を有効化し、他と衝突する線分を消す
    lineCollisionEnabled: parameters.boolean("simulation.line_collision_enabled", true, "s.c"),

    // L-Systemのルールを指定する。 ルールの例はrule_examples.ts
    lSystemRule: parameters.string("simulation.lsystem_rule", defaultRule, "s.r"),

    // L-Systemの **状態の** 突然変異率（ルールの、ではない）
    mutationRate: parameters.float("simulation.mutation_rate", 0, "s.m"),

    // system.run=trueのとき、同時に実行するL-Systemルールの数
    numberOfSeeds: parameters.int("simulation.number_of_seeds", 1, "s.s"),

    concurrentExecutionNumber: parameters.int("simulation.concurrent_execution", 100, "s.ce"),
    lineLifeSpan: parameters.int("simulation.line_life_span", 0, "s.ls"),
    lineLengthType: parameters.int("simulation.line_line_length_type", 0, "s.ll"),
  },
  draw: {
    // trueでcanvas境界に配置した境界線を描画
    showsBorderLine: parameters.boolean("draw.shows_border_line", false, "d.b"),

    // trueで四分木のノードを描画
    showsQuadtree: parameters.boolean("draw.shows_quadtree", false, "d.q"),
  },
}
