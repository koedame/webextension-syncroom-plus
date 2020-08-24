# SYNCROOM Plus

[SYNCROOM のプレイヤーズサイト](https://syncroom.yamaha.com/play/)に機能を追加します。

![SYNCROOM-Plus](/docs/screenshot_2400x1800.jpg)

## 機能

- 👤 各ルームのメンバー表示
- ⭐ メンバーお気に入り登録
- 🔔 メンバーオンライン通知登録
- ⏳ ルームの残り時間表示
- 🔍 高度な検索
- 🚫 満室表示切り替え
- 🔔 満室空き通知登録
- 🍎 ファビコン表示
- 🔗 URL の自動リンク化
- 🐦 TwitterID の自動リンク化
- 🎸 見やすいパートアイコン

## 対応ブラウザ

- ✅ Google Chrome （[Google Chrome 版をインストール](https://chrome.google.com/webstore/detail/syncroom-plus-%E3%83%AB%E3%83%BC%E3%83%A0%E4%B8%80%E8%A6%A7%E3%81%8C%E4%BE%BF%E5%88%A9%E3%81%AB%EF%BC%81/gpgdkbjhojmcmkpldiopicipgolddmfg?hl=ja)）
- ✅ Mozilla Firefox （[Mozilla Firefox 版をインストール](https://addons.mozilla.org/ja/firefox/addon/syncroom-plus/)）
- ✅ Opera（申請中）
- ✅ Microsoft Edge（申請中）

## 開発の始め方

```
docker-compose up
```

`dist` をブラウザに読み込ませ、`src` ディレクトリのファイルを編集してください。

## ビルド手順

```
npm install
npm run build
npm run build-zip
```

`dist-zip` ディレクトリに各ブラウザ用のパッケージがビルドされます。

<hr>

😊 Inspired by SYNCROOM-utility.
