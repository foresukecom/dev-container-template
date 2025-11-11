package middleware

import (
	"context"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/yourusername/go-htmx-oauth-mysql/internal/models"
	"github.com/yourusername/go-htmx-oauth-mysql/internal/repository"
)

type contextKey string

const UserContextKey contextKey = "user"

func AuthRequired(store *sessions.CookieStore, userRepo *repository.UserRepository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, err := store.Get(r, "auth-session")
			if err != nil {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}

			userID, ok := session.Values["user_id"].(int64)
			if !ok || userID == 0 {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}

			// データベースからユーザー情報を取得
			user, err := userRepo.FindByID(userID)
			if err != nil || user == nil {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
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
