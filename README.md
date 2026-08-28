# dev-container-template

階層化された開発コンテナテンプレート集

## 構成

### ベースコンテナ (`base/`)

すべての開発環境で共通利用するベースイメージ

**含まれる機能:**
- Ubuntu 22.04ベース
- 日本語ロケール・タイムゾーン
- zsh + oh-my-zsh
- 基本開発ツール（git, vim, make, just等）
- Claude Code / Gemini CLI
- GitHub CLI（gh）
- ホスト設定ファイルのマウント

### 派生テンプレート

すべてベースイメージ（`devcontainer-base:latest`）から派生します。

#### Go CLI開発環境 (`go-cli/`)
- Go 1.26.5（マルチアーキテクチャ対応 amd64/arm64）
- Go開発ツール一式（goimports, gopls, dlv, staticcheck, golangci-lint）
- Cobra CLI開発特化（cobra-cli）
- Cobra製CLIのサンプル実装 + GoReleaser + GitHub Actionsリリース設定付き

#### Go + HTMX + OAuth開発環境 (`go-htmx-oauth/`)
- Go 1.26.5
- Google OAuth認証付きWebアプリのサンプル実装
- Airによるホットリロード対応

#### Go + HTMX + OAuth + MySQL開発環境 (`go-htmx-oauth-mysql/`)
- `go-htmx-oauth` + MySQL（compose でDB起動、初期化SQL、リポジトリ層）

#### Node.js開発環境 (`node-enhanced/`)
- Node.js 24.x
- yarn, pnpm
- TypeScript, ts-node, nodemon, pm2, eslint, prettier

#### Cloudflare開発環境 (`cloudflare-vite/`)
- Node.js 24.x + pnpm
- wrangler, TypeScript, ts-node
- Cloudflare Pages + Vite + Hono 向け

#### Vue.js開発環境 (`vue-enhanced/`)
- Node.js 24.x
- Vue CLI, create-vue
- yarn, pnpm
- VS Code Vue拡張機能

#### Hugo開発環境 (`hugo-enhanced/`)
- Hugo Extended 0.164.0（マルチアーキテクチャ対応 amd64/arm64）
- Node.js 24.x（PostCSS、Tailwind等対応）

#### Chrome拡張開発環境 (`chrome-extension-enhanced/`)
- Node.js 24.x
- TypeScript + Vite（高速ビルド）
- Manifest V3対応
- Chrome/Chromiumプリインストール
- Popup、Background、Content Script、Options ページのサンプル付き

## セットアップ手順

### 1. ベースイメージのビルド

```bash
cd base/.devcontainer
docker build -t devcontainer-base:latest .
```

### 2. 各コンテナの使用

```bash
# 例: Go CLI開発の場合
cd go-cli
code .
# VS CodeでDev Containerを選択
```

他のテンプレートも同様に、各ディレクトリで `code .` を実行してDev Containerを起動します。

## ホスト設定の連携

以下のホスト設定が自動的にマウントされます：

- `~/.zshrc` → コンテナ内で自動読み込み
- `~/.zsh_history` → 履歴の永続化
- `~/.gitconfig` → Git設定の共有
- `~/.ssh` → SSH鍵の共有
- `~/.claude` → Claude Code のユーザースコープ設定（settings.json, CLAUDE.md, skills, agents, commands 等）と認証情報の共有
- `~/.claude.json` → Claude Code のユーザー状態（テーマ、ユーザースコープの MCP サーバー設定等）の共有
- `~/.config/gh` → GitHub CLI の認証情報の共有（読み書き可）
- `~/Documents/shared` → `/home/developer/shared`（全コンテナ共通の共有ディレクトリ、読み書き可）

`~/.claude` は Claude Code がセッション状態を書き込むため読み書き可でマウントしています。ホスト側で編集した設定・スキルは、コンテナ内の Claude Code でもそのまま使えます。

### GitHub 連携（gh）

すべてのコンテナに GitHub CLI（`gh`）が入っています。Claude Code から issue / PR を扱う場合もこれを使います。

認証はホストの `~/.config/gh` を共有しているため、**どれか 1 つのコンテナで一度ログインすれば、以後すべてのコンテナ・すべてのプロジェクトで有効**です。ホスト側に gh をインストールする必要はありません。

```bash
# 初回のみ、コンテナ内で実行
mkdir -p ~/.config/gh   # ホスト側で事前に作成しておく場合は不要
gh auth login
```

`gh auth login` は「GitHub.com」→「HTTPS」→「Login with a web browser」を選ぶと、8 桁のコードが表示されます。ホスト側のブラウザで `https://github.com/login/device` を開いてコードを入力すれば完了です。

`gh` は git の credential helper としてイメージ側（`/etc/gitconfig`）に設定済みなので、ログイン後は HTTPS リモートに対して `git push` / `git pull` もそのまま通ります。SSH 鍵の設定は不要です。

ホストの `~/.gitconfig` は読み取り専用でマウントしているため、`gh auth setup-git` は実行しないでください（書き込みに失敗します）。同じ設定が system スコープに入っているので、実行する必要もありません。

> 認証トークンはコンテナ内に鍵管理サービスがないため、ホストの `~/.config/gh/hosts.yml` に平文で保存されます（ヘッドレス Linux での gh の標準動作）。気になる場合は権限の絞られた Fine-grained PAT を使ってください。

### 共有ディレクトリ

ホストの `~/Documents/shared` が、すべてのコンテナの `/home/developer/shared` にマウントされます。プロジェクトをまたいで使うスクリプトやメモ、データセットの置き場として使えます。読み書き可なので、コンテナ内で作成したファイルはホスト側にも残ります。

共有元を変えたい場合は、Dev Container を起動する前に `SHARED_DIR` を設定します（compose.yml の編集は不要）。

```bash
export SHARED_DIR=~/Documents/another-dir
```

マウント先は `/workspaces` の外に置いています。`/workspaces` にはプロジェクトが既にマウントされているため、そこに重ねると VS Code のワークスペース内に共有ディレクトリが紛れ込むためです。

なお、ホスト側のディレクトリが存在しないまま起動すると Docker が root 所有の空ディレクトリを作ってしまい、コンテナ内の `developer` ユーザーから書き込めなくなります。共有元は事前に作成しておいてください（`~/.config/gh` も同様です）。

## 新しい開発環境の追加

ベースイメージから派生させます。

```dockerfile
FROM devcontainer-base:latest
USER root
# 新しいツールのインストール
RUN apt-get update && apt-get install -y python3
USER developer
```

Apple Silicon (M1/M2) 対応が必要なバイナリは、アーキテクチャ自動判定を入れてください。

```dockerfile
RUN ARCH=$(uname -m | sed 's/x86_64/amd64/g' | sed 's/aarch64/arm64/g') \
    && wget -O tool.tar.gz "https://example.com/tool-${ARCH}.tar.gz"
```

## トラブルシューティング

### ベースイメージが見つからないエラー

```bash
cd base/.devcontainer
docker build -t devcontainer-base:latest .
```

でベースイメージをビルドしてから、派生コンテナを起動してください。

### Apple Silicon (M1/M2) でのビルドエラー

- go-cli / hugo-enhanced はマルチアーキテクチャ対応済みです
- 他の環境でエラーが出る場合は、アーキテクチャ判定を追加してください
