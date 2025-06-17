package parsers

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/david-santa/vulkyra/backend/internal/repository"
	"github.com/lib/pq"

	"github.com/david-santa/vulkyra/backend/internal/models"
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

func ParseNessusFile(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	return parseAndInsert(file)
}

func parseAndInsert(reader io.Reader) error {
	var data NessusClientData
	if err := xml.NewDecoder(reader).Decode(&data); err != nil {
		return err
	}

	for _, host := range data.Report.ReportHosts {
		ip, fqdn := extractIPAndFQDN(host.HostTags)
		fmt.Println("IP FOUND ", ip)
		assetID, err := getOrCreateAsset(ip, fqdn)
		if err != nil {
			fmt.Printf("Could not create/find asset for IP: %s, FQDN: %s (err: %v)\n", ip, fqdn, err)
			continue
		}

		for _, item := range host.ReportItems {
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
				CVEs:         strings.Split(item.CVE, ","),
				CVSSScore:    item.CVSSBaseScore,
				Refs:         item.SeeAlso,
			}
			err := insertVulnerability(vuln)
			if err != nil {
				fmt.Println(err.Error())
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

func getOrCreateAsset(ip, fqdn string) (int, error) {
	var id int
	// Try to find the asset first
	err := repository.GetDB().QueryRow(`
		SELECT id FROM assets WHERE ip = $1 OR fqdn = $2 LIMIT 1`, ip, fqdn).Scan(&id)
	if err == nil {
		return id, nil
	}
	// If not found, insert it and return the new id
	err = repository.GetDB().QueryRow(`
		INSERT INTO assets (ip, fqdn) VALUES ($1, $2) RETURNING id`, ip, fqdn).Scan(&id)
	return id, err
}

func insertVulnerability(v models.Vulnerability) error {
	_, err := repository.GetDB().Exec(`
		INSERT INTO vulnerabilities (
			asset_id, plugin_id, plugin_name, plugin_family,
			port, protocol, service, severity,
			risk_factor, description, solution, output,
			cves, cvss_score, refs
		) VALUES (
			$1, $2, $3, $4,
			$5, $6, $7, $8,
			$9, $10, $11, $12,
			$13, $14, $15
		)
	`,
		v.AssetID,
		v.PluginID,
		v.PluginName,
		v.PluginFamily,
		v.Port,
		v.Protocol,
		v.Service,
		v.Severity,
		v.RiskFactor,
		v.Description,
		v.Solution,
		v.Output,
		pq.Array(v.CVEs), // For TEXT[] columns, use pq.Array
		v.CVSSScore,
		pq.Array(v.Refs), // For TEXT[] columns, use pq.Array
	)
	return err
}

func ParseAndInsertFromReader(reader io.Reader) error {
	return parseAndInsert(reader)
}
