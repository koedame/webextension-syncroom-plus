# CHANGELOGS

## v1.15.0

### 変更

-  ルーム共有機能追加 

### 依存パッケージ

- @babel/preset-env from 7.14.5 to 7.14.7
- @babel/runtime-corejs3 from 7.14.6 to 7.14.7
- @types/node from 15.12.3 to 15.12.5
- buefy from 0.9.7 to 0.9.8
- copy-webpack-plugin from 9.0.0 to 9.0.1
- core-js from 3.14.0 to 3.15.2
- eslint from 7.28.0 to 7.29.0
- eslint-plugin-vue from 7.11.1 to 7.12.1
- mini-css-extract-plugin from 1.6.0 to 1.6.2
- prettier from 2.3.1 to 2.3.2
- vue-i18n from 8.24.4 to 8.24.5
- webpack from 5.39.1 to 5.41.0

## v1.14.1

### 変更

- 広告枠の不具合修正 

## v1.14.0

### 変更

- 広告枠追加

### 依存パッケージ

- @babel/core from 7.14.3 to 7.14.6
- @babel/preset-env from 7.14.4 to 7.14.5
- @babel/runtime-corejs3 from 7.14.0 to 7.14.6
- @types/node from 15.12.0 to 15.12.3
- @vue/composition-api from 1.0.0-rc.10 to 1.0.0-rc.12
- core-js from 3.13.1 to 3.14.0
- eslint from 7.27.0 to 7.28.0
- eslint-plugin-vue from 7.10.0 to 7.11.1
- prettier from 2.3.0 to 2.3.1
- pretty-quick from 3.1.0 to 3.1.1
- sass from 1.34.1 to 1.35.1
- sass-loader from 12.0.0 to 12.1.0
- typescript from 4.3.2 to 4.3.4
- vue and vue-template-compiler
- webpack from 5.38.1 to 5.39.1
- webpack-cli from 4.7.0 to 4.7.2

## v1.13.0

### 変更

- パスワード保存機能追加

### 依存パッケージ

- @babel/preset-env from 7.14.2 to 7.14.4
- @types/node from 15.6.1 to 15.12.0
- @vue/composition-api from 1.0.0-rc.9 to 1.0.0-rc.10
- core-js from 3.12.1 to 3.13.1
- eslint-plugin-import from 2.23.3 to 2.23.4
- eslint-plugin-vue from 7.9.0 to 7.10.0
- sass from 1.34.0 to 1.34.1
- sass-loader from 11.1.1 to 12.0.0
- twemoji from 13.0.2 to 13.1.0
- typescript from 4.2.4 to 4.3.2
- vue and vue-template-compiler
- webpack from 5.37.1 to 5.38.1

## v1.12.0

### 変更

- 絵文字をTwemojiに置き換え

### 依存パッケージ

- @types/node from 15.3.1 to 15.6.1
- copy-webpack-plugin from 8.1.1 to 9.0.0
- css-loader from 5.2.5 to 5.2.6
- eslint from 7.26.0 to 7.27.0
- eslint-config-standard from 16.0.2 to 16.0.3
- eslint-plugin-import from 2.23.2 to 2.23.3
- sass from 1.33.0 to 1.34.0
- ts-node from 9.1.1 to 10.0.0

## v1.11.2

### 変更

エラーハンドリングを追加

### 依存パッケージ

- sass from 1.32.13 to 1.33.0
- css-loader from 5.2.4 to 5.2.5
- @types/node from 15.0.3 to 15.3.1
- webpack from 5.37.0 to 5.37.1
- @vue/composition-api from 1.0.0-rc.8 to 1.0.0-rc.9
- @babel/core from 7.14.2 to 7.14.3
- eslint-plugin-import from 2.22.1 to 2.23.2

## v1.11.1

### 変更

- URI生成の不具合を修正 

### 依存パッケージ

- sass-loader from 11.1.0 to 11.1.1

## v1.11.0

### 変更

- API負荷対策
- ts移行
- axios設定漏れ修正
- ボリュームメーターGIFをサーバーへ移行
- APIリクエストヘッダーにバージョン情報を追加
- 通知のメッセージパターンを追加
- 入室種別の判定方法を変更
- 不要な処理を削除

### 依存パッケージ

- @babel/core from 7.14.0 to 7.14.2
- @babel/preset-env from 7.14.1 to 7.14.2
- @types/node from 15.0.2 to 15.0.3
- sass from 1.32.12 to 1.32.13
- vue-loader from 15.9.6 to 15.9.7

## v1.10.0

### 変更

- 国旗を追加
- お知らせ機能追加
- Edge対応の通知オプションを追加
- 不要なファイルを削除

### 依存パッケージ

- core-js from 3.12.0 to 3.12.1
- eslint from 7.25.0 to 7.26.0
- prettier from 2.2.1 to 2.3.0
- sass-loader from 11.0.1 to 11.1.0
- webpack from 5.36.2 to 5.37.0

## v1.9.0

### 変更

- パフォーマンス改善
- 部屋情報取得のAPIを独自APIへ変更
- 独自API使用のためにパーミッションを変更
- 一部リソースの置き場所を外部サーバーへ変更
- 一部コードをTypeScript化
- 安全のためURL生成処理を関数を使ったものに変更
- 軽微なUI変更
- 通知アイコンの変更
- 通知をクリックしたときの挙動を変更

### 依存パッケージ

- moment 削除
- moment-timezone 削除
- @babel/preset-env from 7.13.15 to 7.14.1
- @types/node from 15.0.1 to 15.0.2
- core-js from 3.11.1 to 3.12.0
- mini-css-extract-plugin from 1.5.1 to 1.6.0
- sass from 1.32.11 to 1.32.12
- webpack-cli from 4.6.0 to 4.7.0

## v1.8.1

### 変更

- 翻訳修正
- 一部コードを外部ファイル化

### 依存パッケージ

- @babel/core from 7.13.10 to 7.13.15
- @babel/plugin-proposal-optional-chaining from 7.13.8 to 7.13.12
- @babel/preset-env from 7.13.10 to 7.13.15
- @types/node from 14.14.35 to 14.14.39
- @types/webpack from 4.41.26 to 5.28.0
- @vue/composition-api from 1.0.0-rc.5 to 1.0.0-rc.6
- buefy from 0.9.4 to 0.9.6
- copy-webpack-plugin from 8.0.0 to 8.1.1
- core-js from 3.9.1 to 3.10.1
- css-loader from 5.1.3 to 5.2.1
- eslint from 7.22.0 to 7.24.0
- eslint-config-prettier from 8.1.0 to 8.2.0
- eslint-plugin-prettier from 3.3.1 to 3.4.0
- eslint-plugin-promise from 4.3.1 to 5.1.0
- eslint-plugin-vue from 7.8.0 to 7.9.0
- mini-css-extract-plugin from 1.3.9 to 1.4.1
- node from 15.12.0-alpine to 15.14.0-alpine
- ts-loader from 8.0.18 to 8.1.0
- typescript from 4.2.3 to 4.2.4
- vue-i18n from 8.24.2 to 8.24.3
- webpack from 5.27.2 to 5.33.2
- webpack-cli from 4.5.0 to 4.6.0

## v1.8.0

### 変更

- エイプリルフール仕様追加
- webpackのts化
- RoomCard.vueをts化

### 依存パッケージ

- ts-node追加
- husky削除
- ejs削除
- webextension-polyfill => webextension-polyfill-ts
- webpack from 5.23.0 to 5.27.2
- vue-i18n from 8.22.4 to 8.24.2
- typescript from 4.1.5 to 4.2.3
- ts-loader from 8.0.17 to 8.0.18
- pug from 3.0.0 to 3.0.2
- node from 15.9.0-alpine to 15.12.0-alpine
- mini-css-extract-plugin from 1.3.8 to 1.3.9
- eslint-plugin-vue from 7.6.0 to 7.8.0
- eslint-config-prettier from 7.2.0 to 8.1.0
- eslint from 7.20.0 to 7.22.0
- css-loader from 5.0.2 to 5.1.3
- core-js from 3.9.0 to 3.9.1
- copy-webpack-plugin from 7.0.0 to 8.0.0
- archiver from 5.2.0 to 5.3.0
- @vue/composition-api from 1.0.0-rc.2 to 1.0.0-rc.5
- @types/node from 14.14.30 to 14.14.35
- @fortawesome/free-solid-svg-icons from 5.15.2 to 5.15.3
- @fortawesome/fontawesome-svg-core from 1.2.34 to 1.2.35
- @babel/runtime-corejs3 from 7.12.18 to 7.13.10
- @babel/preset-env from 7.12.17 to 7.13.10
- @babel/plugin-proposal-optional-chaining from 7.12.17 to 7.13.0
- @babel/core from 7.12.17 to 7.13.10

## v1.7.1

### 変更

- 日本語以外のとき接続テストルームが開けない不具合を修正
- 一部TypeScript化

### 依存パッケージ

- @babel/core from 7.12.10 to 7.12.17
- @babel/preset-env from 7.12.16 to 7.12.17
- @babel/runtime-corejs3 from 7.12.13 to 7.12.18
- @types/node from 14.14.27 to 14.14.30
- @vue/composition-api from 1.0.0-rc.1 to 1.0.0-rc.2
- core-js from 3.8.3 to 3.9.0
- eslint-plugin-vue from 7.5.0 to 7.6.0
- mini-css-extract-plugin from 1.3.6 to 1.3.8
- node from 15.8.0-alpine to 15.9.0-alpine
- sass from 1.32.7 to 1.32.8
- webpack from 5.21.2 to 5.23.0

## v1.7.0

### 変更

- UI変更
- 多言語対応
  - 英語
  - 韓国語
- .node-version削除
- 一部TypeScript化

### 依存パッケージ

- @types/node
- Node sass => Dart Sass
- @babel/core from 7.12.9 to 7.12.10
- @babel/plugin-proposal-optional-chaining from 7.12.7 to 7.12.16
- @babel/preset-env from 7.12.7 to 7.12.16
- @babel/runtime-corejs3 from 7.12.5 to 7.12.13
- @fortawesome/fontawesome-svg-core from 1.2.32 to 1.2.34
- @fortawesome/free-solid-svg-icons from 5.15.1 to 5.15.2
- @vue/composition-api from 1.0.0-beta.20 to 1.0.0-rc.1
- archiver from 5.1.0 to 5.2.0
- axios from 0.21.0 to 0.21.1
- copy-webpack-plugin from 6.3.2 to 7.0.0
- core-js from 3.8.0 to 3.8.3
- cross-env from 7.0.2 to 7.0.3
- css-loader from 5.0.1 to 5.0.2
- ejs from 3.1.5 to 3.1.6
- eslint from 7.14.0 to 7.20.0
- eslint-config-prettier from 6.15.0 to 7.2.0
- eslint-plugin-prettier from 3.1.4 to 3.3.1
- eslint-plugin-promise from 4.2.1 to 4.3.1
- eslint-plugin-vue from 7.1.0 to 7.5.0
- husky from 4.3.0 to 5.0.9
- mini-css-extract-plugin from 1.3.1 to 1.3.6
- moment-timezone from 0.5.32 to 0.5.33
- node from 15.3.0-alpine to 15.8.0-alpine
- pug-plain-loader from 1.0.0 to 1.1.0
- sass-loader from 10.1.0 to 11.0.1
- ts-loader from 8.0.11 to 8.0.17
- typescript from 4.1.2 to 4.1.5
- vue-i18n from 8.22.3 to 8.22.4
- vuex from 3.6.0 to 3.6.2
- webpack from 4.44.2 to 5.21.2
- webpack-cli from 4.2.0 to 4.5.0

## v1.6.4

### 変更

- ツールチップが途切れる不具合を修正
- node のバージョンを更新
- 不要なパッケージを削除

### 依存パッケージ

- @babel/core from 7.11.6 to 7.12.3
- @babel/plugin-proposal-optional-chaining from 7.11.0 to 7.12.1
- @babel/preset-env from 7.11.5 to 7.12.1
- @babel/runtime-corejs3 from 7.11.2 to 7.12.5
- @vue/composition-api from 1.0.0-beta.16 to 1.0.0-beta.19
- axios from 0.20.0 to 0.21.0
- babel-loader from 8.1.0 to 8.2.2
- buefy from 0.9.3 to 0.9.4
- copy-webpack-plugin from 6.2.1 to 6.3.2
- core-js from 3.6.5 to 3.8.0
- css-loader from 5.0.0 to 5.0.1
- eslint from 7.11.0 to 7.12.1
- eslint from 7.12.1 to 7.14.0
- eslint-config-prettier from 6.12.0 to 6.15.0
- eslint-config-standard from 14.1.1 to 16.0.1
- eslint-plugin-standard from 4.0.1 to 5.0.0
- eslint-plugin-vue from 7.0.1 to 7.1.0
- file-loader from 6.1.1 to 6.2.0
- mini-css-extract-plugin from 1.0.0 to 1.3.1
- moment-timezone from 0.5.31 to 0.5.32
- node from 14.13.1-alpine to 15.3.0-alpine
- node-sass from 4.14.1 to 5.0.0
- sass-loader from 10.0.3 to 10.1.0
- ts-loader from 8.0.5 to 8.0.11
- typescript from 4.0.3 to 4.0.5
- vue-loader from 15.9.3 to 15.9.5
- webextension-polyfill from 0.6.0 to 0.7.0
- webpack-cli from 4.0.0 to 4.2.0

## v1.6.3

### 新規

- ハロウィーン仕様を追加

### 依存パッケージ

- css-loader from 4.3.0 to 5.0.0
- ts-loader from 8.0.4 to 8.0.5
- pretty-quick from 3.0.2 to 3.1.0
- @sentry/browser from 5.25.0 to 5.26.0
- @sentry/integrations from 5.25.0 to 5.26.0
- @sentry/apm from 5.25.0 to 5.26.0

## v1.6.2

### 変更

- 誤字修正

### 依存パッケージ

- webpack-cli from 3.3.12 to 4.0.0
- @vue/composition-api from 1.0.0-beta.15 to 1.0.0-beta.16
- eslint from 7.10.0 to 7.11.0

## v1.6.1

### 変更

- 部屋フィルターを切り替えたときに選択タグをリセットするように

### 依存パッケージ

- mini-css-extract-plugin from 0.12.0 to 1.0.0
- copy-webpack-plugin from 6.2.0 to 6.2.1
- file-loader from 6.1.0 to 6.1.1
- sass-loader from 10.0.2 to 10.0.3

## v1.6.0

### 変更

- タグ一覧と鍵フィルターを連携

### 依存パッケージ

- node from 14.13.0-alpine to 14.13.1-alpine
- mini-css-extract-plugin from 0.11.3 to 0.12.0
- @sentry/integrations from 5.24.2 to 5.25.0
- @sentry/apm from 5.24.2 to 5.25.0
- moment from 2.29.0 to 2.29.1

## v1.5.1

### 変更

- ルームフィルターの自動フォーカスを外すように設定
- node バージョン更新

### 依存パッケージ

- node from 14.11.0-alpine to 14.13.0-alpine
- copy-webpack-plugin from 6.1.1 to 6.2.0
- mini-css-extract-plugin from 0.11.2 to 0.11.3
- @vue/composition-api from 1.0.0-beta.14 to 1.0.0-beta.15
- @sentry/browser from 5.24.2 to 5.25.0
- eslint from 6.8.0 to 7.10.0
- eslint-plugin-vue from 7.0.0 to 7.0.1

## v1.5.0

### 新規

- コンタクトフォーム追加

### 変更

- フッターテキストを変更

### 依存パッケージ

- copy-webpack-plugin from 6.1.0 to 6.1.1
- eslint-config-prettier from 6.11.0 to 6.12.0
- eslint-plugin-import from 2.22.0 to 2.22.1
- eslint-plugin-vue from 6.2.2 to 7.0.0
- webpack from 4.44.1 to 4.44.2

## v1.4.4

### 変更

- リクエストブロッキングを削除

## v1.4.3

### 新規

- 不要なリクエストを無効化

### 依存パッケージ

- @babel/core from 7.11.5 to 7.11.6
- @sentry/apm from 5.22.3 to 5.24.2
- @sentry/browser from 5.22.3 to 5.24.2
- @sentry/integrations from 5.22.3 to 5.24.2
- @vue/composition-api from 1.0.0-beta.11 to 1.0.0-beta.14
- archiver from 5.0.0 to 5.0.2
- buefy from 0.9.2 to 0.9.3
- css-loader from 4.2.2 to 4.3.0
- husky from 4.2.5 to 4.3.0
- mini-css-extract-plugin from 0.11.0 to 0.11.2
- moment from 2.27.0 to 2.29.0
- node from 14.9.0-alpine to 14.11.0-alpine
- pretty-quick from 3.0.0 to 3.0.2
- sass-loader from 10.0.1 to 10.0.2
- ts-loader from 8.0.3 to 8.0.4
- typescript from 4.0.2 to 4.0.3

## v1.4.2

### 変更

- 仮入室のアイコンを匿名に変更

### 依存パッケージ

- [Security] bl from 4.0.2 to 4.0.3
- @babel/core from 7.11.4 to 7.11.5
- @babel/preset-env from 7.11.0 to 7.11.5
- @fortawesome/vue-fontawesome from 0.1.10 to 2.0.0
- copy-webpack-plugin from 6.0.3 to 6.1.0
- mini-css-extract-plugin from 0.10.0 to 0.11.0
- @sentry/browser from 5.21.4 to 5.22.3
- sass-loader from 10.0.0 to 10.0.1
- @sentry/integrations from 5.21.4 to 5.22.3
- file-loader from 6.0.0 to 6.1.0
- @sentry/apm from 5.21.4 to 5.22.3
- node from 14.8.0-alpine to 14.9.0-alpine

## v1.4.1

### 新規

- 手動更新機能
- アニメーション
- 動作の軽量化

### 変更

- タグ選択解除の UI をわかりやすく

## v1.4.0

### 新規

- タグ一覧の表示と絞り込み機能

### 変更

- コードの最適化

### 修正

- ルームが存在しないときになにも表示されなくなる不具合に対応
- 部屋情報取得時のエラーに対応

### 依存パッケージ

- sass-loader from 9.0.3 to 10.0.0
- @sentry/apm from 5.21.3 to 5.21.4
- prettier from 2.0.5 to 2.1.0
- @vue/composition-api from 1.0.0-beta.10 to 1.0.0-beta.11
- @sentry/integrations from 5.21.3 to 5.21.4
- @sentry/browser from 5.21.3 to 5.21.4
- css-loader from 4.2.1 to 4.2.2
- ts-loader from 8.0.2 to 8.0.3

## v1.3.0

### 新規

- ルーム説明のスクロール対応
- URL の自動リンク化
- TwitterID の自動リンク化
- お気に入りの管理機能追加
- オンライン通知の管理機能追加
- TypeScript 対応
- エラートラッキング機能追加

### 変更

- ページ全体を置き換えるように変更
- アイコンを変更
- 非公開入室と仮入室が区別できるように

### 依存パッケージ

- @babel/core from 7.11.1 to 7.11.4
- axios from 0.19.2 to 0.20.0
- vue and vue-template-compiler
- pretty-quick from 2.0.1 to 3.0.0

## v1.2.0

### 新規

- メンバーオンライン通知機能
- 既存の script を無効化
- 対象ページを追加

### 変更

- 軽微な UI 変更

### 依存パッケージ

- ejs from 3.1.3 to 3.1.5

## v1.1.0

### 新規

- Favicon
- FontAwesome
- 検索機能追加
- 満室=>空き通知機能
- 表示するルームがないときにメッセージを表示
- nodenv 対応

### 変更

- 名前を変更
- storage を変更

### 修正

- ヘッダー下の白いスペースを修正
- メンバー名が長いときにお気に入りボタンが隠れる問題を解消
- パフォーマンス改善
  - 不要な props を削除
  - 不要な処理が実行されないように

### 依存パッケージ

- archiver from 3.1.1 to 5.0.0
- copy-webpack-plugin from 5.1.1 to 6.0.3
- cross-env from 5.2.1 to 7.0.2
- css-loader from 3.6.0 to 4.2.1
- css-loader from 3.6.0 to 4.2.1
- ejs from 2.7.4 to 3.1.3
- eslint-loader from 3.0.4 to 4.0.2
- eslint-plugin-node from 10.0.0 to 11.1.0
- file-loader from 5.1.0 to 6.0.0
- husky from 2.7.0 to 4.2.5
- mini-css-extract-plugin from 0.9.0 to 0.10.0
- node from 14.7.0-alpine to 14.8.0-alpine
- prettier from 1.19.1 to 2.0.5
- pretty-quick from 1.11.1 to 2.0.1
- sass-loader from 7.3.1 to 9.0.3
- vue-router from 3.4.2 to 3.4.3
- web-ext-types from 2.3.0 to 3.2.1
- webextension-polyfill from 0.3.1 to 0.6.0

## v1.0.0

初回リリース 🎉
