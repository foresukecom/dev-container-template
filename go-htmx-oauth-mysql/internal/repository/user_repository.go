package repository

import (
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/yourusername/go-htmx-oauth-mysql/internal/models"
)

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

// FindByGoogleID はGoogleIDでユーザーを検索します
func (r *UserRepository) FindByGoogleID(googleID string) (*models.User, error) {
	var user models.User
	query := "SELECT * FROM users WHERE google_id = ?"
	err := r.db.Get(&user, query, googleID)
	if err == sql.ErrNoRows {
		return nil, nil // ユーザーが見つからない場合はnilを返す
	}
	if err != nil {
		return nil, fmt.Errorf("ユーザー検索エラー: %w", err)
	}
	return &user, nil
}

// FindByID はIDでユーザーを検索します
func (r *UserRepository) FindByID(id int64) (*models.User, error) {
	var user models.User
	query := "SELECT * FROM users WHERE id = ?"
	err := r.db.Get(&user, query, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("ユーザー検索エラー: %w", err)
	}
	return &user, nil
}

// Create は新しいユーザーを作成します
func (r *UserRepository) Create(user *models.User) error {
	query := `
		INSERT INTO users (google_id, email, name, picture)
		VALUES (:google_id, :email, :name, :picture)
	`
	result, err := r.db.NamedExec(query, user)
	if err != nil {
		return fmt.Errorf("ユーザー作成エラー: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("ID取得エラー: %w", err)
	}
	user.ID = id
	return nil
}

// Update はユーザー情報を更新します
func (r *UserRepository) Update(user *models.User) error {
	query := `
		UPDATE users
		SET email = :email, name = :name, picture = :picture
		WHERE id = :id
	`
	_, err := r.db.NamedExec(query, user)
	if err != nil {
		return fmt.Errorf("ユーザー更新エラー: %w", err)
	}
	return nil
}

// CreateOrUpdate はユーザーが存在しない場合は作成、存在する場合は更新します
func (r *UserRepository) CreateOrUpdate(user *models.User) error {
	existingUser, err := r.FindByGoogleID(user.GoogleID)
	if err != nil {
		return err
	}

	if existingUser == nil {
		// 新規作成
		return r.Create(user)
	}

	// 既存ユーザーの更新
	user.ID = existingUser.ID
	return r.Update(user)
}
