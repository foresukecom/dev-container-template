# Go + HTMX + OAuth テンプレート

GoバックエンドとHTMXフロントエンドを使用した、Google OAuth認証機能付きのWebアプリケーションテンプレートです。

## 特徴

- **Goバックエンド**: 高速で信頼性の高いサーバーサイド実装
- **HTMX**: モダンなフロントエンド体験をシンプルなHTMLで実現
- **Google OAuth 2.0**: セキュアな認証フロー
- **セッション管理**: Gorilla Sessionsを使用した安全なセッション管理
- **ホットリロード**: Airを使用した開発時の自動リロード
- **レスポンシブデザイン**: モバイルフレンドリーなUI

## 技術スタック

- **バックエンド**: Go 1.23
- **ルーター**: Gorilla Mux
- **フロントエンド**: HTMX
- **認証**: Google OAuth 2.0
- **セッション**: Gorilla Sessions
- **開発ツール**: Air (ホットリロード)

## ディレクトリ構造

```
go-htmx-oauth/
├── .devcontainer/          # Dev Container設定
│   ├── devcontainer.json
│   ├── compose.yml
│   └── Dockerfile
├── cmd/
│   └── server/             # メインアプリケーション
│       └── main.go
├── internal/
│   ├── handlers/           # HTTPハンドラー
│   │   ├── auth.go
│   │   └── pages.go
│   ├── middleware/         # ミドルウェア
│   │   ├── auth.go
│   │   └── logger.go
│   └── models/             # データモデル
│       ├── config.go
│       └── user.go
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

`.env`ファイルを編集してGoogle OAuth情報を設定:

```env
PORT=8080
SESSION_KEY=ランダムな長い文字列に変更してください
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

## 主な機能

### 認証フロー

1. ユーザーが「Googleでログイン」ボタンをクリック
2. Google OAuth認証画面にリダイレクト
3. ユーザーが認証を許可
4. アプリケーションにリダイレクトされ、セッションが作成される
5. ダッシュボードにアクセス可能になる

### エンドポイント

- `GET /` - ホームページ
- `GET /login` - ログインページ
- `GET /auth/google` - Google OAuth認証開始
- `GET /auth/google/callback` - OAuth コールバック
- `POST /auth/logout` - ログアウト
- `GET /auth/status` - 認証状態の確認 (JSON)
- `GET /dashboard` - ダッシュボード (認証必須)

### ミドルウェア

- **Logger**: すべてのHTTPリクエストをログ出力
- **AuthRequired**: 認証が必要なルートを保護

## HTMX の使用例

このテンプレートではHTMXを使用して、JavaScriptを書かずに動的な機能を実装しています。

### 認証状態の動的取得

```html
<div id="auth-status" hx-get="/auth/status" hx-trigger="load" hx-swap="innerHTML">
    <!-- 認証状態がここに表示されます -->
</div>
```

### ログアウトボタン

```html
<button
    hx-post="/auth/logout"
    hx-confirm="ログアウトしてもよろしいですか？"
    class="btn btn-danger">
    ログアウト
</button>
```

## カスタマイズ

### テンプレートの編集

HTMLテンプレートは`templates/`ディレクトリにあります。
- `base.html`: 共通レイアウト
- `index.html`: ホームページ
- `login.html`: ログインページ
- `dashboard.html`: ダッシュボード

### スタイルの編集

CSSは`static/css/style.css`で管理されています。

### 新しいルートの追加

1. `internal/handlers/`に新しいハンドラーを作成
2. `cmd/server/main.go`でルートを登録
3. 必要に応じてテンプレートを作成

## セキュリティに関する注意

- **本番環境**:
  - `.env`ファイルの`SESSION_KEY`を強力なランダム文字列に変更
  - HTTPSを有効化 (`compose.yml`のセッションストアで`Secure: true`に設定)
  - CORS設定を適切に行う
  - 環境変数を安全に管理

- **開発環境**:
  - `.env`ファイルをGitにコミットしない
  - テスト用の認証情報のみを使用

## トラブルシューティング

### ポート8080がすでに使用されている

`.env`ファイルで別のポートを指定:

```env
PORT=3000
```

### OAuth認証エラー

- Google Cloud ConsoleでリダイレクトURIが正しく設定されているか確認
- クライアントIDとシークレットが正しいか確認
- `.env`ファイルの設定を確認

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。
