package service

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/repository"
	"gorm.io/gorm"
)

func GetAllAssets(db *gorm.DB) ([]models.Asset, error) {
	return repository.GetAllAssets(db)
}

func GetAssetByID(db *gorm.DB, id string) (models.Asset, error) {
	return repository.GetAssetByID(db, id)
}

func UpdateAsset(db *gorm.DB, id string, updated models.Asset) (models.Asset, error) {
	return repository.UpdateAsset(db, id, updated)
}
