package parsers

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type NessusClientData struct {
	Report Report `xml:"Report"`
}

type Report struct {
	ReportHosts []ReportHost `xml:"ReportHost"`
}

type ReportHost struct {
	Name        string       `xml:"name,attr"`
	HostTags    []HostTag    `xml:"HostProperties>tag"`
	ReportItems []ReportItem `xml:"ReportItem"`
}

type HostTag struct {
	Name  string `xml:"name,attr"`
	Value string `xml:",chardata"`
}

type ReportItem struct {
	Port         int    `xml:"port,attr"`
	SvcName      string `xml:"svc_name,attr"`
	Protocol     string `xml:"protocol,attr"`
	Severity     int    `xml:"severity,attr"`
	PluginID     int    `xml:"pluginID,attr"`
	PluginName   string `xml:"pluginName,attr"`
	PluginFamily string `xml:"pluginFamily,attr"`

	Description   string   `xml:"description"`
	RiskFactor    string   `xml:"risk_factor"`
	Solution      string   `xml:"solution"`
	PluginOutput  string   `xml:"plugin_output"`
	CVE           string   `xml:"cve"`
	CVSSBaseScore float64  `xml:"cvss_base_score"`
	SeeAlso       []string `xml:"see_also"`
}

// ParseNessusFile now takes a *gorm.DB
func ParseNessusFile(db *gorm.DB, path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	return parseAndInsert(db, file)
}

func parseAndInsert(db *gorm.DB, reader io.Reader) error {
	var data NessusClientData
	if err := xml.NewDecoder(reader).Decode(&data); err != nil {
		return err
	}

	for _, host := range data.Report.ReportHosts {
		ip, fqdn := extractIPAndFQDN(host.HostTags)
		assetID, err := getOrCreateAssetGORM(db, ip, fqdn)
		if err != nil {
			fmt.Printf("Could not create/find asset for IP: %s, FQDN: %s (err: %v)\n", ip, fqdn, err)
			continue
		}

		for _, item := range host.ReportItems {
			// Convert comma-separated CVE string to []string, ignore empty
			cveSlice := []string{}
			if strings.TrimSpace(item.CVE) != "" {
				for _, cve := range strings.Split(item.CVE, ",") {
					cve = strings.TrimSpace(cve)
					if cve != "" {
						cveSlice = append(cveSlice, cve)
					}
				}
			}
			cvesJSON, _ := json.Marshal(cveSlice)
			refsJSON, _ := json.Marshal(item.SeeAlso)

			vuln := models.Vulnerability{
				AssetID:      assetID,
				PluginID:     item.PluginID,
				PluginName:   item.PluginName,
				PluginFamily: item.PluginFamily,
				Port:         item.Port,
				Protocol:     item.Protocol,
				Service:      item.SvcName,
				Severity:     item.Severity,
				RiskFactor:   item.RiskFactor,
				Description:  item.Description,
				Solution:     item.Solution,
				Output:       item.PluginOutput,
				CVEs:         cvesJSON,
				CVSSScore:    item.CVSSBaseScore,
				Refs:         refsJSON,
				OwnerID:      uuid.Nil, // Use actual owner if available
			}
			if err := db.Create(&vuln).Error; err != nil {
				fmt.Println("Insert vulnerability error:", err)
			}
		}
	}
	return nil
}

func extractIPAndFQDN(tags []HostTag) (ip, fqdn string) {
	for _, tag := range tags {
		if tag.Name == "host-ip" {
			ip = tag.Value
		}
		if tag.Name == "host-fqdn" {
			fqdn = tag.Value
		}
	}
	return
}

// Uses GORM and UUIDs!
func getOrCreateAssetGORM(db *gorm.DB, ip, fqdn string) (uuid.UUID, error) {
	var asset models.Asset
	var unassingedVulnerabilitiesTeam models.Team
	result := db.Where("ip_address = ? OR fqdn = ?", ip, fqdn).First(&asset)
	if result.Error == nil {
		return asset.AssetID, nil
	}
	if result.Error != gorm.ErrRecordNotFound {
		return uuid.Nil, result.Error
	}
	teamQueryResult := db.Where("team_name = ?", "Unassigned Vulnerabilities").First(&unassingedVulnerabilitiesTeam)
	if teamQueryResult != nil {
		fmt.Println("Failed to get unassigned vulnerabilities team UUID")
	}

	asset = models.Asset{
		FQDN:      fqdn,
		IPAddress: ip,
		OwnerID:   unassingedVulnerabilitiesTeam.TeamID,
	}
	if err := db.Create(&asset).Error; err != nil {
		return uuid.Nil, err
	}
	return asset.AssetID, nil
}

// For streaming reads, e.g. from an uploaded file
func ParseAndInsertFromReader(db *gorm.DB, reader io.Reader) error {
	return parseAndInsert(db, reader)
}
