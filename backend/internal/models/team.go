package models

import (
	"github.com/google/uuid"
	_ "gorm.io/gorm"
)

type Team struct {
	TeamID    uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	TeamName  string     `gorm:"unique;not null"`
	TeamEmail string     `gorm:"unique;not null"`
	ParentID  *uuid.UUID // Nullable to allow top-level teams
	Parent    *Team      `gorm:"foreignKey:ParentID"` // The parent team object
	Assets    []Asset    `gorm:"foreignKey:OwnerID"`
}
