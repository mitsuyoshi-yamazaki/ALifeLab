# チュートリアル
## ゲームに参加：用意された祖先種を放つ
目標：ゲームに参加する

1. `src/simulations/modular_life/ancestor/source_code.ts` に定義済みのふるまいのひとつを使って `src/simulations/modular_life/source.ts` の `initializeLives()` で祖先種を作成し、世界に放つ

## 自身で祖先種を実装する
目標：祖先種のプログラムを行う

1. `Module.SourceCode` に準拠する処理を自分で実装し、祖先種を作成して世界に放つ
2. `src/simulations/modular_life/api.ts` の `ComputerApi` の各APIを使ってみる

## 祖先種の仕様を変更する
*未実装*

目標：祖先種の身体仕様を理解する

1. 定義済みの `src/simulations/modular_life/ancestor/ancestor.ts` の `createAncestor()` を参照し、今まで作成した生命のモジュール構成を知る
1. モジュール（ `Module.Module` ）構成を変更した祖先種を実装し、世界に放つ

## 自己複製する祖先種を実装する
*未実装*

目標：自己複製する生命を実装して世界に放つ

# 参考
- [APIリファレンス](./docs/api_reference.md)
  - APIおよびモジュールの仕様
