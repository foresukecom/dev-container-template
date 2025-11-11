package models

import (
	"os"
)

type Config struct {
	Port              string
	SessionKey        string
	GoogleClientID    string
	GoogleClientSecret string
	GoogleRedirectURL string
	AppURL            string
}

func LoadConfig() *Config {
	return &Config{
		Port:              getEnv("PORT", "8080"),
		SessionKey:        getEnv("SESSION_KEY", "default-secret-key-change-in-production"),
		GoogleClientID:    getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL: getEnv("GOOGLE_REDIRECT_URL", "http://localhost:8080/auth/google/callback"),
		AppURL:            getEnv("APP_URL", "http://localhost:8080"),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
