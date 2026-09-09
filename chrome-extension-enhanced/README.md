# Chrome Extension Development Template

TypeScript + Vite を使用した、モダンな Chrome 拡張機能開発テンプレートです。

## 特徴

- **TypeScript**: 型安全な開発環境
- **Vite**: 高速なビルド（ファイル監視による自動リビルド）
- **Manifest V3**: 最新の Chrome 拡張機能仕様に対応
- **Playwright**: 実際に Chromium へ拡張機能を読み込んで動かす E2E テスト付き
- **Dev Container**: VS Code で即座に開発を開始できる環境（amd64 / arm64 両対応）
- **完全なサンプル**: Popup、Background、Content Script、Options ページを含む

## 技術スタック

- **言語**: TypeScript 6.x
- **ビルドツール**: Vite 8.x
- **テスト**: Playwright 1.63（Chromium）
- **リンター**: ESLint 10 + typescript-eslint
- **フォーマッター**: Prettier 3.x
- **開発環境**: Dev Container（Node.js 24.x + Playwright Chromium）

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
├── tests/                  # Playwright E2Eテスト
│   ├── fixtures.ts         # 拡張機能を読み込むカスタムフィクスチャ
│   └── extension.spec.ts
├── icons/
│   └── icon.svg            # アイコンの元データ（これ1つを差し替える）
├── scripts/
│   └── generate-icons.mjs  # SVG → PNG 変換
├── manifest.json           # 拡張機能のマニフェスト
├── vite.config.ts          # Vite設定
├── playwright.config.ts    # Playwright設定
├── tsconfig.json           # TypeScript設定
├── package.json
└── README.md
```

`public/` と `dist/` は生成物のため git 管理外です。

## セットアップ

### 前提条件

このテンプレートは Dev Container を使用します。以下が必要です：

- Docker Desktop
- Visual Studio Code
- Dev Containers 拡張機能

または、ローカル環境に Node.js 24.x 以降。

### Dev Container での起動（推奨）

```bash
cd chrome-extension-enhanced
code .
```

VS Code で「Dev Container で再度開く」を選択します。`postCreateCommand` で `npm install` と
Playwright の Chromium 取得まで自動的に実行されます。

### ローカル環境での起動

```bash
cd chrome-extension-enhanced
npm install
npx playwright install chromium   # テストを実行する場合
```

## 開発

### ビルド

```bash
npm run build
```

`icons/icon.svg` から PNG を生成したうえで、`dist/` に拡張機能一式を出力します。

### 開発モード（ファイル監視）

```bash
npm run dev
```

変更を検知して自動的にリビルドします。**Vite の HMR は効きません**（拡張機能の制約）。
リビルド後は `chrome://extensions/` で拡張機能の「更新」ボタンを押してください。

### テスト

```bash
npm run test          # ヘッドレスで実行
npm run test:headed   # ブラウザを表示して実行（コンテナ内では xvfb-run と併用）
```

実際に Chromium へ `dist/` を読み込ませ、service worker の起動、popup の動作、
設定の永続化、content script の注入までを検証します。

### リント / フォーマット / 型チェック

```bash
npm run lint
npm run format
npm run type-check
```

### ストア提出用パッケージ

```bash
npm run package   # extension.zip を生成
```

## Chrome への拡張機能の読み込み

1. `npm run build` を実行
2. Chrome で `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `dist/` フォルダを選択

> Dev Container 内の Chromium は Playwright がテストで使うためのもので、GUI はありません。
> 目視確認はホスト側の Chrome で `dist/` を読み込んで行ってください。

## アイコン

`icons/icon.svg` が唯一の元データです。ビルド時に `scripts/generate-icons.mjs` が
16 / 48 / 128px の PNG を `public/icons/` に生成します（Chrome は SVG アイコンを読み込めません）。

アイコンを変えたい場合は `icons/icon.svg` を差し替えるだけです。サイズを追加する場合は
スクリプト内の `SIZES` と `manifest.json` の `icons` / `action.default_icon` を合わせて更新してください。

なお、元データにテキスト要素（`<text>`）を使うと、フォントが入っていない環境では
描画が崩れます。図形で表現することを推奨します。

## バージョン管理

拡張機能のバージョンは **`package.json` の `version` が正**です。ビルド時に
`manifest.json` へ流し込まれるため、`manifest.json` 側の値を編集する必要はありません。

## 権限について

初期状態の `permissions` は `storage` / `activeTab` / `contextMenus` のみで、
`host_permissions` は付けていません。必要になった時点で `manifest.json` に追加してください。

`chrome.tabs.query()` を URL で絞り込む場合は `tabs` 権限が必要になります。
権限を増やさずに済ませたい場合は、`{ active: true, currentWindow: true }` で
アクティブタブを取得してください（`tests/extension.spec.ts` がこの書き方の例です）。

## 拡張機能の構成要素

### Popup (ポップアップ)

拡張機能のアイコンをクリックしたときに表示される UI。

- **ファイル**: [src/popup/popup.html](src/popup/popup.html), [src/popup/popup.ts](src/popup/popup.ts), [src/popup/popup.css](src/popup/popup.css)
- **用途**: ユーザーとのインタラクション、設定の表示/変更

### Background (バックグラウンド)

バックグラウンドで動作する Service Worker。

- **ファイル**: [src/background/background.ts](src/background/background.ts)
- **用途**: イベントリスナー、メッセージング、API呼び出し
- **注意**: Manifest V3 では常駐せず、必要なときに起動して終了します

### Content Script (コンテンツスクリプト)

Webページに注入されるスクリプト。

- **ファイル**: [src/content/content.ts](src/content/content.ts), [src/content/content.css](src/content/content.css)
- **用途**: ページのDOM操作、情報の抽出
- **制限**: ページのJavaScript環境とは分離されている

サンプルの `highlightText()` はテキストノードだけを辿って `<mark>` で囲みます。
`document.body.innerHTML` を組み立て直すとページ側のイベントリスナーが失われるため、
その方法は避けてください。

### Options (オプションページ)

拡張機能の設定画面。

- **ファイル**: [src/options/options.html](src/options/options.html), [src/options/options.ts](src/options/options.ts), [src/options/options.css](src/options/options.css)
- **用途**: 詳細な設定、環境設定の管理

## カスタマイズ

### 基本情報の変更

[manifest.json](manifest.json) を編集します（`version` を除く）。

```json
{
  "name": "あなたの拡張機能名",
  "description": "拡張機能の説明",
  "permissions": ["storage", "activeTab"]
}
```

### 新しいページ/スクリプトの追加

1. `src/` 内に新しいディレクトリを作成
2. TypeScript ファイルを追加
3. `vite.config.ts` の `input` に追加
4. `manifest.json` に必要な権限やエントリーポイントを追加
5. `tests/extension.spec.ts` にテストを追加

## ビルド出力

```
dist/
├── manifest.json        # package.json の version が反映される
├── background.js        # service worker（固定名）
├── content.js           # content script（固定名）
├── content.css
├── popup/popup.html
├── options/options.html
├── icons/icon{16,48,128}.png
└── assets/              # ハッシュ付きのJS/CSS
```

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
// アクティブなタブを取得（追加の権限が不要）
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  console.log(tabs[0].id);
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

### テストのデバッグ

```bash
npx playwright test --debug        # ステップ実行
npx playwright show-report         # 失敗時のレポートを表示
```

## トラブルシューティング

### ビルドエラー

```bash
rm -rf node_modules package-lock.json
npm install
```

### Chrome で拡張機能が読み込まれない

- `npm run build` を実行済みか確認（`dist/` が無いと読み込めません）
- `chrome://extensions/` のエラーメッセージを確認
- `manifest.json` が参照するファイルが `dist/` に存在するか確認

### テストで「browser is not installed」と出る

```bash
npx playwright install chromium
```

### Content Script が動作しない

- `manifest.json` の `content_scripts` の `matches` パターンを確認
- ページをリロード
- `chrome://extensions/` で拡張機能を更新

## リソース

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome APIs Reference](https://developer.chrome.com/docs/extensions/reference/)
- [Playwright: Chrome extensions](https://playwright.dev/docs/chrome-extensions)
- [Vite Documentation](https://vitejs.dev/)

## ライセンス

MIT License
