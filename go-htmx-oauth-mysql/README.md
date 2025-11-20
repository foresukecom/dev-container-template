# Go + HTMX + OAuth + MySQL テンプレート

GoバックエンドとHTMXフロントエンドを使用した、Google OAuth認証とMySQL データベース対応のWebアプリケーションテンプレートです。

## 特徴

- **Goバックエンド**: 高速で信頼性の高いサーバーサイド実装
- **HTMX**: モダンなフロントエンド体験をシンプルなHTMLで実現
- **Google OAuth 2.0**: セキュアな認証フロー
- **MySQL 8.0**: リレーショナルデータベースでユーザー情報を永続化
- **リポジトリパターン**: データアクセス層の抽象化
- **セッション管理**: Gorilla Sessionsを使用した安全なセッション管理
- **ホットリロード**: Airを使用した開発時の自動リロード
- **レスポンシブデザイン**: モバイルフレンドリーなUI

## 技術スタック

- **バックエンド**: Go 1.23
- **ルーター**: Gorilla Mux
- **フロントエンド**: HTMX
- **認証**: Google OAuth 2.0
- **データベース**: MySQL 8.0
- **ORMライブラリ**: sqlx
- **セッション**: Gorilla Sessions
- **開発ツール**: Air (ホットリロード)

## ディレクトリ構造

```
go-htmx-oauth-mysql/
├── .devcontainer/          # Dev Container設定
│   ├── devcontainer.json
│   ├── compose.yml         # Go + MySQL
│   ├── Dockerfile
│   └── init.sql            # DB初期化スクリプト
├── cmd/
│   └── server/             # メインアプリケーション
│       └── main.go
├── internal/
│   ├── database/           # DB接続
│   │   └── mysql.go
│   ├── handlers/           # HTTPハンドラー
│   │   ├── auth.go
│   │   └── pages.go
│   ├── middleware/         # ミドルウェア
│   │   ├── auth.go
│   │   └── logger.go
│   ├── models/             # データモデル
│   │   ├── config.go
│   │   └── user.go
│   └── repository/         # リポジトリパターン
│       └── user_repository.go
├── static/                 # 静的ファイル
│   ├── css/
│   │   └── style.css
│   └── js/
├── templates/              # HTMLテンプレート
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   └── dashboard.html
├── .env.example            # 環境変数テンプレート
├── .gitignore
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## セットアップ

### 1. Google OAuth認証の設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuthクライアントID」を選択
5. アプリケーションの種類で「ウェブアプリケーション」を選択
6. 承認済みのリダイレクトURIに以下を追加:
   - `http://localhost:8080/auth/google/callback`
7. クライアントIDとクライアントシークレットをコピー

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成:

```bash
cp .env.example .env
```

`.env`ファイルを編集:

```env
PORT=8080
SESSION_KEY=ランダムな長い文字列に変更してください

# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=apppassword
DB_NAME=appdb

# Google OAuth Configuration
GOOGLE_CLIENT_ID=あなたのGoogleクライアントID
GOOGLE_CLIENT_SECRET=あなたのGoogleクライアントシークレット
GOOGLE_REDIRECT_URL=http://localhost:8080/auth/google/callback

APP_URL=http://localhost:8080
```

### 3. 依存関係のインストール

```bash
make install
```

## 使い方

### 開発環境での起動 (ホットリロード付き)

```bash
make dev
```

### 通常起動

```bash
make run
```

### ビルド

```bash
make build
```

実行ファイルは`bin/server`に生成されます。

## データベース

### テーブル構造

#### users テーブル
| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | BIGINT | 主キー (AUTO_INCREMENT) |
| google_id | VARCHAR(255) | Google ユーザーID (UNIQUE) |
| email | VARCHAR(255) | メールアドレス (UNIQUE) |
| name | VARCHAR(255) | ユーザー名 |
| picture | VARCHAR(512) | プロフィール画像URL |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### マイグレーション

初期化スクリプトは`.devcontainer/init.sql`にあり、コンテナ起動時に自動実行されます。

### データベース接続

#### VSCode SQLTools拡張機能を使用する場合

開発コンテナには `mtxr.sqltools` と `mtxr.sqltools-driver-mysql` がプリインストールされています。

1. VSCodeのサイドバーでSQLToolsアイコンをクリック
2. 「+」ボタンで新しい接続を追加
3. 以下の情報を入力:
   - Connection Name: MySQL (任意)
   - Server Address: mysql
   - Port: 3306
   - Database: appdb
   - Username: appuser
   - Password: apppassword

#### コマンドラインから接続する場合

開発コンテナ内のターミナルで以下のコマンドを実行:

```bash
# 対話的にMySQLに接続
mysql -h mysql -u appuser -papppassword appdb

# SQLファイルを実行
mysql -h mysql -u appuser -papppassword appdb < your-script.sql

# クエリを直接実行
mysql -h mysql -u appuser -papppassword appdb -e "SELECT * FROM users;"
```

**注意**: 開発コンテナ内からは`-h mysql`でMySQLコンテナに接続します。ホストOSからは`-h localhost`または`-h 127.0.0.1`を使用してください。

## 主な機能

### 認証フロー

1. ユーザーが「Googleでログイン」ボタンをクリック
2. Google OAuth認証画面にリダイレクト
3. ユーザーが認証を許可
4. アプリケーションにリダイレクトされる
5. **ユーザー情報をMySQLに保存または更新**
6. セッションにユーザーIDを保存
7. ダッシュボードにアクセス可能になる

### エンドポイント

- `GET /` - ホームページ
- `GET /login` - ログインページ
- `GET /auth/google` - Google OAuth認証開始
- `GET /auth/google/callback` - OAuth コールバック
- `POST /auth/logout` - ログアウト
- `GET /auth/status` - 認証状態の確認 (JSON)
- `GET /auth/nav-status` - ナビゲーションバー用認証状態 (HTML)
- `GET /dashboard` - ダッシュボード (認証必須)

### リポジトリパターン

データアクセス層が抽象化されており、テスト可能な設計になっています:

```go
// ユーザーをGoogle IDで検索
user, err := userRepo.FindByGoogleID(googleID)

// 新規ユーザー作成
err := userRepo.Create(user)

// ユーザー情報更新
err := userRepo.Update(user)

// 作成または更新
err := userRepo.CreateOrUpdate(user)
```

## 開発のヒント

### データベースの初期化

コンテナを再構築してデータベースをリセット:

```bash
docker compose down -v
```

### ログの確認

```bash
docker compose logs -f devcontainer
docker compose logs -f mysql
```

### SQLの実行

```bash
docker compose exec mysql mysql -u appuser -papppassword appdb
```

## カスタマイズ

### テンプレートの編集

HTMLテンプレートは`templates/`ディレクトリにあります。

### スタイルの編集

CSSは`static/css/style.css`で管理されています。

### 新しいテーブルの追加

1. `.devcontainer/init.sql`にCREATE TABLE文を追加
2. `internal/models/`に対応する構造体を作成
3. `internal/repository/`にリポジトリを実装
4. ハンドラーとルートを追加

## セキュリティに関する注意

- **本番環境**:
  - `.env`ファイルの`SESSION_KEY`を強力なランダム文字列に変更
  - HTTPSを有効化 (`compose.yml`のセッションストアで`Secure: true`に設定)
  - データベースのパスワードを強固なものに変更
  - CORSを適切に設定
  - 環境変数を安全に管理

- **開発環境**:
  - `.env`ファイルをGitにコミットしない
  - テスト用の認証情報のみを使用
  - データベースポートを外部に公開しない

## トラブルシューティング

### ポート8080がすでに使用されている

`.env`ファイルで別のポートを指定。

### データベース接続エラー

- MySQLコンテナが起動しているか確認: `docker compose ps`
- ヘルスチェックが完了しているか確認
- 環境変数が正しく設定されているか確認

### OAuth認証エラー

- Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
- クライアントIDとシークレットが正しいか確認

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。
