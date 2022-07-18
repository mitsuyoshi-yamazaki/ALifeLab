# ALifeLab

<img src="resources/lsystem_artboard.jpg">

## Getting started
```shell
# Install
$ yarn install

# Build
$ yarn build

# Run
$ yarn start

# Test
$ yarn test

# Lint
$ yarn eslint
```

## シミュレーションの追加
1. シミュレーション名（以下 `sim_name` ）を決定する
2. `src/simulations/template/` をコピー
3. ディレクトリ以下の `html_arguments.json` の各項目を設定する（ `script_path` の `file_name.js` は `<sim_name>.js` にリネーム）
4. `$ yarn build` にて `pages/` 以下にHTMLファイルが生成されるので、リンクを一覧ページ( `src/pages/lab/index.tsx` )などに載せる
5. `webpack.config.js` の `entry` 以下に `<sim_name>: "./src/simulations/<sim_name>/layout.tsx"` の項を追加

## Wallpaper
<img src="https://user-images.githubusercontent.com/904354/126030410-18d98a5f-1675-4a1c-9ef7-4d53083fa6d5.png" width=320>

