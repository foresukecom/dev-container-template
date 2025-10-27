# Hugo開発環境

ベースコンテナをベースにしたHugo静的サイトジェネレーター開発環境

## 含まれる機能

### Hugo
- **Hugo Extended** v0.139.3
  - SCSS/SASS処理対応
  - WebP画像処理対応
  - その他拡張機能

### Node.js環境
- **Node.js** 20.x
- **PostCSS関連ツール**
  - postcss-cli
  - autoprefixer
  - postcss-purgecss

### VS Code拡張機能
- **Hugo開発**
  - Hugo Language Support
  - Front Matter CMS（記事管理）
- **Markdown編集**
  - Markdown All in One
  - Markdown Lint
- **設定ファイル**
  - Even Better TOML
  - YAML Support
- **Web開発**
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## セットアップ

### 1. ベースイメージのビルド

まずベースコンテナイメージをビルドしてください：

```bash
cd ../base/.devcontainer
docker build -t devcontainer-base:latest .
```

### 2. Hugo環境の起動

```bash
cd hugo-enhanced
code .
```

VS Codeで「Dev Containerで再度開く」を選択

## 使い方

### 新規Hugoサイトの作成

```bash
hugo new site mysite
cd mysite
```

### テーマのインストール例

```bash
# テーマをgit submoduleとして追加
git init
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
echo "theme = 'ananke'" >> hugo.toml
```

### 開発サーバーの起動

```bash
hugo server -D --bind 0.0.0.0
```

ブラウザで `http://localhost:1313` にアクセス

### 記事の作成

```bash
hugo new content posts/my-first-post.md
```

### ビルド

```bash
hugo
```

生成されたサイトは `public/` ディレクトリに出力されます。

## ポート

- **1313**: Hugo開発サーバー（自動でフォワード設定済み）

## ホスト設定の連携

ベースコンテナから継承：
- `~/.zshrc` - シェル設定
- `~/.zsh_history` - コマンド履歴
- `~/.gitconfig` - Git設定
- `~/.ssh` - SSH鍵

## よく使うコマンド

```bash
# バージョン確認
hugo version

# 新規記事作成
hugo new content posts/記事名.md

# 開発サーバー起動（下書きも表示）
hugo server -D --bind 0.0.0.0

# 本番ビルド
hugo --minify

# テーマ一覧表示
hugo list themes
```

## Tips

### PostCSSを使う場合

`package.json` を作成：

```json
{
  "devDependencies": {
    "postcss": "^8.4.31",
    "postcss-cli": "^10.1.0",
    "autoprefixer": "^10.4.16"
  }
}
```

```bash
npm install
```

### Tailwind CSSを使う場合

```bash
npm install -D tailwindcss
npx tailwindcss init
```

## トラブルシューティング

### ポート1313が使用できない

別のポートを指定：
```bash
hugo server -D --bind 0.0.0.0 --port 1314
```

`compose.yml` のポート設定も変更してください。

### テーマが見つからない

テーマディレクトリとconfigファイル（hugo.toml/yaml/json）を確認：
```bash
ls themes/
cat hugo.toml
```