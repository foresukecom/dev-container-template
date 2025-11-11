.PHONY: run dev build clean install help

help: ## ヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## 依存関係をインストール
	go mod download
	go mod tidy

run: ## サーバーを起動
	go run cmd/server/main.go

dev: ## ホットリロード付きでサーバーを起動
	air

build: ## 実行ファイルをビルド
	go build -o bin/server cmd/server/main.go

clean: ## 生成ファイルを削除
	rm -rf bin/ tmp/

test: ## テストを実行
	go test -v ./...

fmt: ## コードをフォーマット
	go fmt ./...
	goimports -w .

lint: ## コードをリント
	golangci-lint run
