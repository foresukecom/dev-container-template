package models

import "time"

type User struct {
	ID        int64     `db:"id" json:"id"`
	GoogleID  string    `db:"google_id" json:"google_id"`
	Email     string    `db:"email" json:"email"`
	Name      string    `db:"name" json:"name"`
	Picture   string    `db:"picture" json:"picture"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
