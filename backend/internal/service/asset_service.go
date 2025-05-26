package service

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/repository"
)

func GetAllAssets() ([]models.Asset, error) {
	return repository.GetAllAssets()
}
