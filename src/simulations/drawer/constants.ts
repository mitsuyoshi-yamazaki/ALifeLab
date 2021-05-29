import { URLParameterParser } from "../../classes/url_parameter_parser"

/*
 * ascii: 状態により色が決まる
 * depth: ノードの深さ（ルートまでの距離）により色が決まる // 未実装
 */
type ColorTheme = "grayscale" | "ascii" | "depth" | "direction" | "transition"

const parameters = new URLParameterParser()

// 指定できるURLパラメータの一覧
// parameters.boolean/int/float/string("パラメータ名", 指定されない場合のデフォルト値, "パラメータ名省略記法")
export const constants = {
  system: {
    // Canvasサイズ
    fieldSize: parameters.int("system.size", 600, "s"),

    // 1で綺麗そうな絵になるルールを自動探索 
    run: parameters.boolean("system.run", false, "r"),

    // system.run=1の場合、1で有望なルールと画像を自動的にダウンロード
    autoDownload: parameters.boolean("system.auto_download", false, "d"),

    // 1で四分木による計算量削減を有効化
    quadtreeEnabled: parameters.boolean("system.quadtree", true, "q"),
  },
  simulation: {
    // 動作を遅くしたい場合に増やす。1未満の値（高速化）は動作しない
    executionInterval: parameters.int("simulation.execution_interval", 1, "s.i"),

    // 描画する線分の上限
    maxLineCount: parameters.int("simulation.max_line_count", 5000, "s.l"),

    // 1で線分の衝突判定を有効化し、他と衝突する線分を消す
    lineCollisionEnabled: parameters.boolean("simulation.line_collision_enabled", true, "s.c"),

    // L-Systemのルールを指定する。 ルールの例はrule_examples.ts
    lSystemRule: parameters.string("simulation.lsystem_rule", "", "s.r"),

    // L-Systemの **状態の** 突然変異率（ルールの、ではない）
    mutationRate: parameters.float("simulation.mutation_rate", 0, "s.m"),

    // system.run=1のとき、同時に実行するL-Systemルールの数
    numberOfSeeds: parameters.int("simulation.number_of_seeds", 1, "s.s"),

    // 1で描画開始位置を固定する。system.run=0のときのみ有効
    fixedStartPoint: parameters.boolean("simulation.fixed_start_point", false, "s.f"),

    // 障害物を配置
    obstacle: parameters.boolean("simulation.obstacle", false, "s.ob"),

    concurrentExecutionNumber: parameters.int("simulation.concurrent_execution", 100, "s.ce"),
    lineLifeSpan: parameters.int("simulation.line_life_span", 10, "s.ls"),
    lineLengthType: parameters.int("simulation.line_line_length_type", 0, "s.ll"),
    symmetric: parameters.boolean("simulation.force_simmetric", false, "s.sy"),
  },
  draw: {
    // 1でcanvas境界に配置した境界線を描画
    showsBorderLine: parameters.boolean("draw.shows_border_line", false, "d.b"),

    // 1で四分木のノードを描画
    showsQuadtree: parameters.boolean("draw.shows_quadtree", false, "d.q"),

    // 色の設定
    colorTheme: parameters.string("draw.color_theme", "grayscale", "d.c") as ColorTheme,
  },
}
