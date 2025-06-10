package repository

import (
	"log"

	"github.com/david-santa/vulkyra/backend/internal/models"
)

func GetAllAssets() ([]models.Asset, error) {
	rows, err := db.Query("SELECT id, fqdn, ip, owner_id FROM assets")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var assets []models.Asset
	for rows.Next() {
		var asset models.Asset
		if err := rows.Scan(&asset.ID, &asset.FQDN, &asset.IP, &asset.OwnerID); err != nil {
			return nil, err
		}
		assets = append(assets, asset)
	}
	return assets, nil
}

func InsertDummyAssets() error {
	dummyAssets := []models.Asset{
		{FQDN: "host1.example.com", IP: "10.0.0.1", OwnerID: 3},
		{FQDN: "host2.example.com", IP: "10.0.0.2", OwnerID: 6},
	}

	for _, asset := range dummyAssets {
		_, err := db.Exec("INSERT INTO assets (fqdn, ip, owner_id) VALUES ($1, $2, $3)", asset.FQDN, asset.IP, asset.OwnerID)
		if err != nil {
			log.Println("Error inserting asset:", err)
		}
	}
	return nil
}
