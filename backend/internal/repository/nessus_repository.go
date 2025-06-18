package repository

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
)

func BulkInsertAssets(assets []models.Asset) error {
	for _, asset := range assets {
		_, err := db.Exec("INSERT INTO assets (fqdn, ip, owner_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
			asset.FQDN, asset.IP, asset.OwnerID)
		if err != nil {
			return err
		}
	}
	return nil
}

func BulkInsertVulnerabilities(vulns []models.Vulnerability) error {
	for _, vuln := range vulns {
		_, err := db.Exec("INSERT INTO vulnerabilities (asset_id, cve, severity, plugin_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
			vuln.AssetID, vuln.CVEs, vuln.Severity, vuln.PluginID)
		if err != nil {
			return err
		}
	}
	return nil
}
