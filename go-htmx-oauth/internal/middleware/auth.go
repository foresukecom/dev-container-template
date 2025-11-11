package middleware

import (
	"context"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/yourusername/go-htmx-oauth/internal/models"
)

type contextKey string

const UserContextKey contextKey = "user"

func AuthRequired(store *sessions.CookieStore) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, err := store.Get(r, "auth-session")
			if err != nil {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}

			userID, ok := session.Values["user_id"].(string)
			if !ok || userID == "" {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}

			// ユーザー情報をコンテキストに保存
			user := &models.User{
				ID:      userID,
				Email:   session.Values["user_email"].(string),
				Name:    session.Values["user_name"].(string),
				Picture: session.Values["user_picture"].(string),
			}

			ctx := context.WithValue(r.Context(), UserContextKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserFromContext(ctx context.Context) *models.User {
	user, ok := ctx.Value(UserContextKey).(*models.User)
	if !ok {
		return nil
	}
	return user
}
