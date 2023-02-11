# 人工生命の箱庭（仮
## 概要
プログラミングした生命を世界に放って生態系がどのように変化するか観察するゲーム

## プレイ方法
1. `src/simulations/modular_life/ancestor/source_code.ts` を参考に、生命の挙動を定義する `Module.SourceCode` を実装する
1. `src/simulations/modular_life/source.ts` の `initializeLives()` 内で祖先種を作成し、世界に追加する

### API
`src/simulations/modular_life/api.ts` を参照

## ゲームシステム
### 要件
- プログラミングでまったく自由な行動を行える
- 人工生命である
  - 最終的な目標は、それ自体はOpen-Endedでないある程度プリミティブな系に、人間の想像力を投入してOpen-Endedを達成する

### 仕様
- 計算
  - Computorが最初
- 位置
  - 現状ではcollisionはない

## アイデア
- 自動でエネルギーを分配する循環系をつくることができる
- アップデートで抽象度を落としていく
