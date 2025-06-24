package repository

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"gorm.io/gorm"
)

// Pass *gorm.DB explicitly, or store in struct/context for real app
func GetAllAssets(db *gorm.DB) ([]models.Asset, error) {
	var assets []models.Asset
	err := db.Find(&assets).Error
	return assets, err
}

func GetAssetByID(db *gorm.DB, id string) (models.Asset, error) {
	var asset models.Asset
	err := db.First(&asset, "id = ?", id).Error
	return asset, err
}

func UpdateAsset(db *gorm.DB, id string, updated models.Asset) (models.Asset, error) {
	var asset models.Asset
	if err := db.First(&asset, "id = ?", id).Error; err != nil {
		return asset, err
	}
	// Only update fields that are allowed
	asset.FQDN = updated.FQDN
	asset.IPAddress = updated.IPAddress
	asset.OwnerID = updated.OwnerID

	err := db.Save(&asset).Error
	return asset, err
}

func InsertDummyAssets(db *gorm.DB) error {
	dummyAssets := []models.Asset{
		{FQDN: "host1.vulkyra.com", IPAddress: "10.0.0.1"},
		{FQDN: "host2.vulkyra.com", IPAddress: "10.0.0.2"},
	}
	return db.Create(&dummyAssets).Error
}
