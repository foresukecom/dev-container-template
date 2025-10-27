# ベース開発コンテナ

## 概要
このディレクトリには、他の開発コンテナで共通利用するベースイメージの定義が含まれています。

## 含まれる機能
- Ubuntu 22.04ベース
- 日本語ロケール（ja_JP.UTF-8）
- 日本のタイムゾーン（Asia/Tokyo）
- zshとoh-my-zsh
- 基本開発ツール（git, vim, make, build-essential等）
- ホストの.zsh設定ファイルのマウント対応

## ベースイメージのビルド

このベースイメージを使用する前に、ローカルでイメージをビルドする必要があります：

```bash
# ベースディレクトリに移動
cd base/.devcontainer

# ベースイメージをビルド
docker build -t devcontainer-base:latest .
```

## ホスト設定ファイルのマウント

以下のホスト設定ファイルがコンテナ内にマウントされます：

- `~/.zshrc` → `/home/developer/.zshrc_host`（読み取り専用）
- `~/.zsh_history` → `/home/developer/.zsh_history`（キャッシュ）
- `~/.zsh_aliases` → `/home/developer/.zsh_aliases`（読み取り専用）
- `~/.gitconfig` → `/home/developer/.gitconfig`（読み取り専用）
- `~/.ssh` → `/home/developer/.ssh`（読み取り専用）

ホストの.zshrcがある場合、コンテナ起動時に自動的に読み込まれます。

## 使用例

このベースイメージを使用した派生コンテナの例：

- `go-enhanced`: Go開発環境
- `vue-enhanced`: Vue.js開発環境

各派生コンテナはこのベースイメージから継承し、必要な開発ツールを追加します。