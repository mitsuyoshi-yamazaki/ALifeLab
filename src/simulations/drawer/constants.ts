import { Vector } from "../../classes/physics"
import { random } from "../../classes/utilities"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { exampleRules } from "./rule_examples"

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("system.size", 600, "s")
const defaultRule = exampleRules[Math.floor(random(exampleRules.length))] // TODO: URLパラメータに反映させる

export const constants = {
  system: {
    // Canvasサイズ
    fieldSize: new Vector(fieldBaseSize, fieldBaseSize * 0.6),

    // trueで綺麗そうな絵になるルールを自動探索 
    run: parameters.boolean("system.run", false, "r"),

    // trueで四分木による計算量削減を有効化
    quadtreeEnabled: parameters.boolean("system.quadtree", true, "q"),
  },
  simulation: {
    // 動作を遅くしたい場合に増やす。1未満の値（高速化）はサポートされない
    executionInteral: parameters.int("simulation.execution_interval", 1, "s.i"),

    // 描画する線分の上限
    maxLineCount: parameters.int("simulation.max_line_count", 5000, "s.l"),

    // trueで線分の衝突判定を有効化し、他と衝突する線分を消す
    lineCollisionEnabled: parameters.boolean("simulation.line_collision_enabled", true, "s.c"),

    // L-Systemのルールを指定する。 see: rule_examples.ts
    lSystemRule: parameters.string("simulation.lsystem_rule", defaultRule, "s.r"),

    // L-Systemの **状態の** 突然変異率（ルールの、ではない）
    mutationRate: parameters.float("simulation.mutation_rate", 0, "s.m"),

    // system.run=trueのとき、同時に実行するL-Systemルールの数
    numberOfSeeds: parameters.int("simulation.number_of_seeds", 3, "s.s"),

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
