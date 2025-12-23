# QR Reader

画像から QR コードを読み取り、内容を表示・コピーするためのシンプルな SPA です。ファイル選択と
クリップボード貼り付けの両方に対応しています。

## 機能

- 画像ファイル選択／貼り付けで画像を読み込み
- QR コードを解析して内容を表示
- URL はクリック可能なリンクとして表示
- 結果をワンクリックでコピー
- PNG / JPEG / WEBP（最大 5MB）対応

## 必要環境

- Node.js 20 以上推奨

## セットアップ

```bash
npm install
```

```bash
npm run dev
```

## 使い方

1. 画像ファイルを選択するか、ページを開いた状態で `Ctrl + V / Command + V` で貼り付けます。
2. QR コードが検出されると内容が表示されます。
3. 必要に応じて「コピー」ボタンで結果をコピーします。

## ビルド

```bash
npm run build
```

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS
- jsQR
