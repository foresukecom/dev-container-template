# dev-container-template

階層化された開発コンテナテンプレート集

## 構成

### ベースコンテナ (`base/`)
すべての開発環境で共通利用するベースイメージ

**含まれる機能:**
- Ubuntu 22.04ベース
- 日本語ロケール・タイムゾーン
- zsh + oh-my-zsh
- 基本開発ツール（git, vim, make等）
- ホスト設定ファイルのマウント

### 独立型コンテナ

#### Go開発環境 (`go-enhanced/`)
- Ubuntu 22.04ベース（独立構成）
- Go 1.23.4（Apple Silicon/Intel対応）
- Go開発ツール（goimports, gopls, dlv, golangci-lint等）
- VS Code Go拡張機能
- マルチアーキテクチャ対応（amd64/arm64自動判定）

### ベースコンテナ依存環境

#### Vue.js開発環境 (`vue-enhanced/`)
- ベースコンテナ + Node.js 20.x
- Vue CLI, create-vue
- yarn, pnpm
- VS Code Vue拡張機能

#### Hugo開発環境 (`hugo-enhanced/`)
- ベースコンテナ + Hugo Extended 0.150.1
- Node.js 20.x（PostCSS、Tailwind等対応）
- マルチアーキテクチャ対応（amd64/arm64自動判定）

#### Go CLI開発環境 (`go-cli/`)
- ベースコンテナ + Go 1.23.4
- Cobra CLI開発特化
- Go開発ツール一式

#### Chrome拡張開発環境 (`chrome-extension-enhanced/`)
- ベースコンテナ + Node.js 20.x
- TypeScript + Vite（高速ビルド）
- Manifest V3対応
- Chrome/Chromiumプリインストール
- Popup、Background、Content Script、Options ページのサンプル付き

## セットアップ手順

### 独立型コンテナの場合（go-enhanced）

ベースイメージのビルドは不要です。直接使用できます。

```bash
cd go-enhanced
code .
# VS CodeでDev Containerを選択
```

### ベースコンテナ依存環境の場合

#### 1. ベースイメージのビルド

```bash
cd base/.devcontainer
docker build -t devcontainer-base:latest .
```

#### 2. 各コンテナの使用

```bash
# Vue.js開発の場合
cd vue-enhanced
code .
# VS CodeでDev Containerを選択

# Hugo開発の場合
cd hugo-enhanced
code .
# VS CodeでDev Containerを選択

# Go CLI開発の場合
cd go-cli
code .
# VS CodeでDev Containerを選択

# Chrome拡張開発の場合
cd chrome-extension-enhanced
code .
# VS CodeでDev Containerを選択
```

## ホスト設定の連携

以下のホスト設定が自動的にマウントされます：

- `~/.zshrc` → コンテナ内で自動読み込み
- `~/.zsh_history` → 履歴の永続化
- `~/.gitconfig` → Git設定の共有
- `~/.ssh` → SSH鍵の共有

## 新しい開発環境の追加

### パターン1: ベースイメージから派生

```dockerfile
FROM devcontainer-base:latest
USER root
# 新しいツールのインストール
RUN apt-get update && apt-get install -y python3
USER developer
```

### パターン2: 独立構成（Apple Silicon対応が必要な場合）

go-enhancedを参考に、Ubuntu 22.04から直接ビルドし、マルチアーキテクチャ対応を実装します。

```dockerfile
FROM ubuntu:22.04
# ... 基本設定 ...
# アーキテクチャ自動判定の例
RUN ARCH=$(uname -m | sed 's/x86_64/amd64/g' | sed 's/aarch64/arm64/g') \
    && wget -O tool.tar.gz "https://example.com/tool-${ARCH}.tar.gz"
```

## トラブルシューティング

### Apple Silicon (M1/M2) でのビルドエラー

- go-enhancedは自動的にarm64に対応します
- hugo-enhancedもマルチアーキテクチャ対応済みです
- 他の環境でエラーが出る場合は、アーキテクチャ判定を追加してください

### ベースイメージが見つからないエラー

```bash
cd base/.devcontainer
docker build -t devcontainer-base:latest .
```

でベースイメージをビルドしてから、派生コンテナを起動してください。