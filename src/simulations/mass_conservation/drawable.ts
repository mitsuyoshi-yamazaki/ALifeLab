/**
# Drawable
## 概要
状態を描画処理と切り離すためのインターフェース
 */

export type DrawableState = {
  readonly case: string
}
export type DrawableStateInvisible = {
  readonly case: "invisible"
}

export interface Drawable<State extends DrawableState> {
  drawableState(): State
}