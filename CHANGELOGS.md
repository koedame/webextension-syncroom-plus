# CHANGELOGS

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
