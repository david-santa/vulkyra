package repository

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// BulkInsertAssets inserts multiple assets and ignores conflicts (e.g. duplicates)
func BulkInsertAssets(db *gorm.DB, assets []models.Asset) error {
	if len(assets) == 0 {
		return nil
	}
	return db.Clauses(clause.OnConflict{DoNothing: true}).Create(&assets).Error
}

// BulkInsertVulnerabilities inserts multiple vulnerabilities, ignores conflicts
func BulkInsertVulnerabilities(db *gorm.DB, vulns []models.Vulnerability) error {
	if len(vulns) == 0 {
		return nil
	}
	return db.Clauses(clause.OnConflict{DoNothing: true}).Create(&vulns).Error
}
