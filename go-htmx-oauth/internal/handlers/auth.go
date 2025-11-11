package handlers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/yourusername/go-htmx-oauth/internal/models"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthHandler struct {
	config *models.Config
	store  *sessions.CookieStore
	oauth  *oauth2.Config
}

func NewAuthHandler(config *models.Config, store *sessions.CookieStore) *AuthHandler {
	oauth := &oauth2.Config{
		ClientID:     config.GoogleClientID,
		ClientSecret: config.GoogleClientSecret,
		RedirectURL:  config.GoogleRedirectURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &AuthHandler{
		config: config,
		store:  store,
		oauth:  oauth,
	}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	// CSRFトークン生成
	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)

	session, _ := h.store.Get(r, "auth-session")
	session.Values["state"] = state
	session.Save(r, w)

	url := h.oauth.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *AuthHandler) Callback(w http.ResponseWriter, r *http.Request) {
	session, err := h.store.Get(r, "auth-session")
	if err != nil {
		http.Error(w, "セッションエラー", http.StatusInternalServerError)
		return
	}

	// CSRF検証
	state := r.FormValue("state")
	if state != session.Values["state"] {
		http.Error(w, "不正なリクエスト", http.StatusBadRequest)
		return
	}

	// 認証コードをトークンに交換
	code := r.FormValue("code")
	token, err := h.oauth.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "トークン取得エラー", http.StatusInternalServerError)
		return
	}

	// ユーザー情報取得
	client := h.oauth.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		http.Error(w, "ユーザー情報取得エラー", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)
	var userInfo struct {
		ID      string `json:"id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}
	json.Unmarshal(data, &userInfo)

	// セッションにユーザー情報を保存
	session.Values["user_id"] = userInfo.ID
	session.Values["user_email"] = userInfo.Email
	session.Values["user_name"] = userInfo.Name
	session.Values["user_picture"] = userInfo.Picture
	session.Save(r, w)

	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	session, err := h.store.Get(r, "auth-session")
	if err != nil {
		http.Error(w, "セッションエラー", http.StatusInternalServerError)
		return
	}

	session.Values["user_id"] = ""
	session.Options.MaxAge = -1
	session.Save(r, w)

	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func (h *AuthHandler) Status(w http.ResponseWriter, r *http.Request) {
	session, err := h.store.Get(r, "auth-session")
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]bool{"authenticated": false})
		return
	}

	userID, ok := session.Values["user_id"].(string)
	authenticated := ok && userID != ""

	w.Header().Set("Content-Type", "application/json")
	if authenticated {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"authenticated": true,
			"user": map[string]string{
				"id":      userID,
				"email":   fmt.Sprint(session.Values["user_email"]),
				"name":    fmt.Sprint(session.Values["user_name"]),
				"picture": fmt.Sprint(session.Values["user_picture"]),
			},
		})
	} else {
		json.NewEncoder(w).Encode(map[string]bool{"authenticated": false})
	}
}
