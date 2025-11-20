# Chrome Extension Development Template

TypeScript + Vite を使用した、モダンな Chrome 拡張機能開発テンプレートです。

## 特徴

- **TypeScript**: 型安全な開発環境
- **Vite**: 高速なビルドとホットリロード
- **Manifest V3**: 最新の Chrome 拡張機能仕様に対応
- **Dev Container**: VS Code で即座に開発を開始できる環境
- **完全なサンプル**: Popup、Background、Content Script、Options ページを含む

## 技術スタック

- **言語**: TypeScript 5.x
- **ビルドツール**: Vite 5.x
- **リンター**: ESLint + TypeScript ESLint
- **フォーマッター**: Prettier
- **開発環境**: Dev Container (Node.js 20.x + Chrome)

## ディレクトリ構造

```
chrome-extension-enhanced/
├── .devcontainer/          # Dev Container設定
│   ├── devcontainer.json
│   ├── compose.yml
│   └── Dockerfile
├── src/
│   ├── popup/              # ポップアップUI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.ts
│   ├── background/         # バックグラウンドスクリプト
│   │   └── background.ts
│   ├── content/            # コンテンツスクリプト
│   │   ├── content.ts
│   │   └── content.css
│   └── options/            # オプションページ
│       ├── options.html
│       ├── options.css
│       └── options.ts
├── public/
│   └── icons/              # 拡張機能のアイコン
├── manifest.json           # 拡張機能のマニフェスト
├── vite.config.ts          # Vite設定
├── tsconfig.json           # TypeScript設定
├── package.json
└── README.md
```

## セットアップ

### 前提条件

このテンプレートは Dev Container を使用します。以下が必要です：

- Docker Desktop
- Visual Studio Code
- Dev Containers 拡張機能

または、ローカル環境に以下をインストール：

- Node.js 20.x 以降
- npm または pnpm

### Dev Container での起動（推奨）

1. リポジトリをクローン:

```bash
cd chrome-extension-enhanced
code .
```

2. VS Code で「Dev Container で再度開く」を選択

3. コンテナ内で依存関係をインストール:

```bash
npm install
# または
pnpm install
```

### ローカル環境での起動

```bash
cd chrome-extension-enhanced
npm install
```

## 開発

### 開発モード（ウォッチモード）

ファイルの変更を監視して自動的にビルドします：

```bash
npm run dev
```

### ビルド

本番用にビルド：

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### リント

```bash
npm run lint
```

### フォーマット

```bash
npm run format
```

### 型チェック

```bash
npm run type-check
```

## Chrome への拡張機能の読み込み

1. Chrome で `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `dist/` フォルダを選択

開発中は、ファイルを変更するたびに以下を実行：

- `npm run dev` でビルド（ウォッチモードなら自動）
- Chrome の拡張機能ページで「更新」ボタンをクリック

## 拡張機能の構成要素

### Popup (ポップアップ)

拡張機能のアイコンをクリックしたときに表示される UI。

- **ファイル**: [src/popup/popup.html](src/popup/popup.html), [src/popup/popup.ts](src/popup/popup.ts), [src/popup/popup.css](src/popup/popup.css)
- **用途**: ユーザーとのインタラクション、設定の表示/変更

### Background (バックグラウンド)

バックグラウンドで常駐する Service Worker。

- **ファイル**: [src/background/background.ts](src/background/background.ts)
- **用途**: イベントリスナー、メッセージング、API呼び出し
- **注意**: Manifest V3 では Service Worker として動作

### Content Script (コンテンツスクリプト)

Webページに注入されるスクリプト。

- **ファイル**: [src/content/content.ts](src/content/content.ts), [src/content/content.css](src/content/content.css)
- **用途**: ページのDOM操作、情報の抽出
- **制限**: ページのJavaScript環境とは分離されている

### Options (オプションページ)

拡張機能の設定画面。

- **ファイル**: [src/options/options.html](src/options/options.html), [src/options/options.ts](src/options/options.ts), [src/options/options.css](src/options/options.css)
- **用途**: 詳細な設定、環境設定の管理

## カスタマイズ

### 基本情報の変更

[manifest.json](manifest.json) を編集して、拡張機能の名前、説明、権限などを変更します：

```json
{
  "name": "あなたの拡張機能名",
  "version": "1.0.0",
  "description": "拡張機能の説明",
  "permissions": ["storage", "activeTab"]
}
```

### アイコンの変更

`public/icons/` に以下のサイズのアイコンを配置：

- `icon16.png` - 16x16px
- `icon48.png` - 48x48px
- `icon128.png` - 128x128px

### 新しい機能の追加

1. 必要に応じて `src/` 内に新しいディレクトリを作成
2. TypeScript ファイルを追加
3. `vite.config.ts` の `input` に追加
4. `manifest.json` に必要な権限やエントリーポイントを追加

## Chrome API の使用例

### ストレージ

```typescript
// 保存
chrome.storage.sync.set({ key: 'value' });

// 取得
chrome.storage.sync.get(['key'], (result) => {
  console.log(result.key);
});
```

### タブ操作

```typescript
// アクティブなタブを取得
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  console.log(tabs[0].url);
});
```

### メッセージング

```typescript
// Background から Content Script へ
chrome.tabs.sendMessage(tabId, { action: 'doSomething' });

// Content Script から Background へ
chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
  console.log(response);
});
```

## デバッグ

### Popup のデバッグ

1. ポップアップを開く
2. ポップアップ内で右クリック → 「検証」

### Background のデバッグ

1. `chrome://extensions/` を開く
2. 拡張機能の「Service Worker」リンクをクリック

### Content Script のデバッグ

1. 対象のページで開発者ツールを開く
2. Console タブで Content Script のログを確認

## トラブルシューティング

### ビルドエラー

```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### Chrome で拡張機能が読み込まれない

- `manifest.json` の構文エラーを確認
- `dist/` フォルダが存在し、ビルド成果物が含まれているか確認
- Chrome の拡張機能ページでエラーメッセージを確認

### Content Script が動作しない

- `manifest.json` の `content_scripts` セクションで `matches` パターンが正しいか確認
- ページをリロード
- Chrome の拡張機能ページで拡張機能を更新

## リソース

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome APIs Reference](https://developer.chrome.com/docs/extensions/reference/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まず issue を開いて変更内容を議論してください。
