package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/yourusername/go-htmx-oauth/internal/handlers"
	"github.com/yourusername/go-htmx-oauth/internal/middleware"
	"github.com/yourusername/go-htmx-oauth/internal/models"
)

func main() {
	// .envファイルを読み込み
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .envファイルが見つかりません。環境変数から読み込みます。")
	}

	// 設定読み込み
	config := models.LoadConfig()

	// セッションストア初期化
	store := sessions.NewCookieStore([]byte(config.SessionKey))
	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7, // 7日間
		HttpOnly: true,
		Secure:   false, // 本番環境ではtrueに設定
		SameSite: http.SameSiteLaxMode,
	}

	// ハンドラー初期化
	authHandler := handlers.NewAuthHandler(config, store)
	pageHandler := handlers.NewPageHandler()

	// ルーター設定
	r := mux.NewRouter()

	// ミドルウェア
	r.Use(middleware.Logger)

	// 静的ファイル
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	// 公開ページ
	r.HandleFunc("/", pageHandler.Home).Methods("GET")
	r.HandleFunc("/login", pageHandler.Login).Methods("GET")

	// 認証
	r.HandleFunc("/auth/google", authHandler.Login).Methods("GET")
	r.HandleFunc("/auth/google/callback", authHandler.Callback).Methods("GET")
	r.HandleFunc("/auth/logout", authHandler.Logout).Methods("POST")
	r.HandleFunc("/auth/status", authHandler.Status).Methods("GET")
	r.HandleFunc("/auth/nav-status", authHandler.NavStatus).Methods("GET")

	// 認証が必要なページ
	protected := r.PathPrefix("/").Subrouter()
	protected.Use(middleware.AuthRequired(store))
	protected.HandleFunc("/dashboard", pageHandler.Dashboard).Methods("GET")

	// サーバー起動
	log.Printf("サーバーを起動します: http://localhost:%s", config.Port)
	log.Fatal(http.ListenAndServe(":"+config.Port, r))
}
