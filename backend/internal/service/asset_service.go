package service

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/repository"
)

func GetAllAssets() ([]models.Asset, error) {
	return repository.GetAllAssets()
}

func GetAssetByID(id int) (models.Asset, error) {
	return repository.GetAssetByID(id)
}

func UpdateAsset(id int, updated models.Asset) (models.Asset, error) {
	return repository.UpdateAsset(id, updated)
}
