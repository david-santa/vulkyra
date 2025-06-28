package models

import (
	"time"

	"github.com/google/uuid"
	_ "gorm.io/gorm"
)

type Asset struct {
	AssetID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	FQDN               string    `gorm:"not null"`
	IPAddress          string    `gorm:"not null"` // INET is stored as string in GORM
	AssetType          string    `gorm:"not null"`
	Environment        string
	OwnerID            uuid.UUID `gorm:"type:uuid"`
	Owner              Team      `gorm:"foreignKey:OwnerID"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
	Vulnerabilities    []Vulnerability `gorm:"foreignKey:AssetID"`
	VulnerabilityCount int64           `gorm:"default:0"`
}
