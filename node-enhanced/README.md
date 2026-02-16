# Node.js Enhanced 開発環境

Node.js アプリケーション開発に最適化された Dev Container 環境です。

## 特徴

- **Node.js 24.x** - 最新版
- **複数のパッケージマネージャー** - npm, yarn, pnpm 対応
- **TypeScript対応** - ts-node, typescript がプリインストール
- **開発ツール充実** - nodemon, pm2, eslint, prettier 等
- **zsh + oh-my-zsh** - 快適なシェル環境
- **Claude Code** - AI アシスタント統合
- **日本語ロケール** - ja_JP.UTF-8

## 含まれるツール

### ランタイム・言語
| ツール | バージョン | 説明 |
|--------|-----------|------|
| Node.js | 24.x | JavaScript ランタイム |
| npm | 最新 | Node.js 標準パッケージマネージャー |
| yarn | 最新 | 高速パッケージマネージャー |
| pnpm | 最新 | 効率的なパッケージマネージャー |

### グローバルツール
| ツール | 説明 |
|--------|------|
| typescript | TypeScript コンパイラ |
| ts-node | TypeScript 実行環境 |
| nodemon | ファイル監視・自動再起動 |
| pm2 | プロセスマネージャー |
| eslint | コード品質チェック |
| prettier | コードフォーマッター |
| npm-check-updates | パッケージ更新チェック |

### VS Code 拡張機能
- **ESLint** - リアルタイムコード検証
- **Prettier** - 自動フォーマット
- **TypeScript Next** - 最新 TypeScript サポート
- **npm Intellisense** - npm パッケージ補完
- **Path Intellisense** - パス補完
- **Import Cost** - インポートサイズ表示
- **Jest** - テスト実行・デバッグ
- **REST Client** - API テスト

## 使い方

### 1. この環境を使う

```bash
# このディレクトリを新しいプロジェクトにコピー
cp -r node-enhanced /path/to/your-project

# VS Code で開く
code /path/to/your-project
```

VS Code で「Reopen in Container」を選択してコンテナを起動します。

### 2. 新規プロジェクト作成例

```bash
# Express アプリ
npx express-generator myapp --view=ejs
cd myapp && npm install

# Next.js アプリ
npx create-next-app@latest my-next-app

# Nest.js アプリ
npx @nestjs/cli new my-nest-app

# Vite + React
npm create vite@latest my-vite-app -- --template react-ts

# Fastify アプリ
npx fastify-cli generate my-fastify-app
```

### 3. 開発サーバー起動

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

## ポートフォワード

| ポート | 用途 |
|--------|------|
| 3000 | Express, Next.js など |
| 4000 | GraphQL, Apollo Server |
| 5173 | Vite 開発サーバー |
| 8080 | 汎用 |

## プロジェクト構成例

### Express + TypeScript

```
my-project/
├── .devcontainer/
│   ├── Dockerfile
│   ├── compose.yml
│   └── devcontainer.json
├── src/
│   ├── index.ts
│   ├── routes/
│   └── middleware/
├── package.json
├── tsconfig.json
└── .eslintrc.js
```

### package.json 例

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## カスタマイズ

### 追加パッケージのインストール

Dockerfile に追加：

```dockerfile
# 例: データベースクライアント
RUN npm install -g prisma
```

### VS Code 設定の変更

`devcontainer.json` の `settings` セクションを編集：

```json
{
  "settings": {
    "editor.tabSize": 4,
    "typescript.preferences.importModuleSpecifier": "relative"
  }
}
```

## トラブルシューティング

### node_modules の権限エラー

```bash
sudo chown -R developer:developer node_modules
```

### キャッシュクリア

```bash
# npm
npm cache clean --force

# yarn
yarn cache clean

# pnpm
pnpm store prune
```

### ポートが使用中

```bash
# 使用中のポートを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>
```

## 関連テンプレート

- [vue-enhanced](../vue-enhanced/) - Vue.js 専用環境
- [chrome-extension-enhanced](../chrome-extension-enhanced/) - Chrome 拡張機能開発
- [base](../base/) - ベースコンテナ
