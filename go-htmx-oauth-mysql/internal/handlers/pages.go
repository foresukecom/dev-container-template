package handlers

import (
	"html/template"
	"net/http"

	"github.com/yourusername/go-htmx-oauth-mysql/internal/middleware"
)

type PageHandler struct {
	templates *template.Template
}

func NewPageHandler() *PageHandler {
	templates := template.Must(template.ParseGlob("templates/*.html"))
	return &PageHandler{
		templates: templates,
	}
}

func (h *PageHandler) Home(w http.ResponseWriter, r *http.Request) {
	h.templates.ExecuteTemplate(w, "index.html", nil)
}

func (h *PageHandler) Login(w http.ResponseWriter, r *http.Request) {
	h.templates.ExecuteTemplate(w, "login.html", nil)
}

func (h *PageHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r.Context())
	h.templates.ExecuteTemplate(w, "dashboard.html", user)
}
