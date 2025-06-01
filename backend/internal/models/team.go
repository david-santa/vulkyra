package models

type Team struct {
	ID       int64  `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	ParentID int64  `json:"parent_id" db:"parent_id"`
}
