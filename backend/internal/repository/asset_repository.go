package repository

import (
	"log"

	"github.com/david-santa/vulkyra/backend/internal/models"
	"gorm.io/gorm"
)

func GetAllAssets(db *gorm.DB) ([]models.Asset, error) {
	var assets []models.Asset
	err := db.Preload("Owner").Find(&assets).Error
	return assets, err
}

func GetAssetByID(db *gorm.DB, id string) (models.Asset, error) {
	var asset models.Asset
	err := db.First(&asset, "asset_id = ?", id).Error
	return asset, err
}

func UpdateAsset(db *gorm.DB, id string, updated models.Asset) (models.Asset, error) {
	var asset models.Asset
	if err := db.First(&asset, "asset_id = ?", id).Error; err != nil {
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

	var team models.Team
	if err := db.Where("team_name = ?", "Unassigned Vulnerabilities").First(&team).Error; err != nil {
		log.Fatal("No team found for asset owner:", err)
	}
	dummyAssets := []models.Asset{
		{FQDN: "host1.vulkyra.com", IPAddress: "10.0.0.1", OwnerID: team.TeamID},
		{FQDN: "host2.vulkyra.com", IPAddress: "10.0.0.2", OwnerID: team.TeamID},
	}
	return db.Create(&dummyAssets).Error
}
