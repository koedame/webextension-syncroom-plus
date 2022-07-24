# SYNCROOM Plus

[SYNCROOM のプレイヤーズサイト](https://syncroom.yamaha.com/play/)に機能を追加します。

![SYNCROOM-Plus](/docs/screenshot_2400x1800.jpg)

## 機能

- 👤 各ルームのメンバー表示
- ⭐ メンバーお気に入り管理機能
- 🚫 メンバーブロック管理機能
- 🔔 メンバーオンライン通知機能
- ⏳ ルームの残り時間表示
- 🔍 高度なルーム検索
- 🚫 満室表示切り替え
- 🔔 満室空き通知登録
- 🍎 ファビコン表示
- 🔗 URL の自動リンク化
- 🔖 タグ一覧の表示と絞り込み
- 🌏 多言語対応
- 📌 お知らせ表示
- 🔐 パスワード保存機能
- 🔍 メンバー検索機能
- 📝 プロフィール編集機能

## 対応ブラウザ

- ✅ Google Chrome （[Google Chrome 版をインストール](https://chrome.google.com/webstore/detail/syncroom-plus-%E3%83%AB%E3%83%BC%E3%83%A0%E4%B8%80%E8%A6%A7%E3%81%8C%E4%BE%BF%E5%88%A9%E3%81%AB%EF%BC%81/gpgdkbjhojmcmkpldiopicipgolddmfg?hl=ja)）
- ✅ Mozilla Firefox （[Mozilla Firefox 版をインストール](https://addons.mozilla.org/ja/firefox/addon/syncroom-plus/)）
- ✅ Microsoft Edge（[Microsoft Edge 版をインストール](https://microsoftedge.microsoft.com/addons/detail/syncroom-plus-%E3%83%AB%E3%83%BC%E3%83%A0%E4%B8%80%E8%A6%A7%E3%81%8C%E4%BE%BF%E5%88%A9%E3%81%AB/jidoehgenjfemiclndkcockblmbcihem?hl=ja)）

## 開発の始め方

```
docker compose up
```

`dist` をブラウザに読み込ませ、`src` ディレクトリのファイルを編集してください。

## テストの実行

```
docker compose run --rm builder yarn test
```

`dist` をブラウザに読み込ませ、`src` ディレクトリのファイルを編集してください。

## ビルド手順

```
docker compose run --rm builder ./scripts/build.sh
```

`dist-zip` ディレクトリに各ブラウザ用のパッケージがビルドされます。
