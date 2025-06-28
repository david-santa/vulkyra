package ownership

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func AssignAssetOwnershipBasedOnIP(db *gorm.DB, IP string) uuid.UUID {
	teamName := searchStaticCSVOwnershipByIP(IP)
	if teamName != "" {
		var team struct{ TeamID uuid.UUID }
		if err := db.Table("teams").Where("team_name = ?", teamName).Select("team_id").First(&team).Error; err == nil {
			return team.TeamID
		}
	}
	// fallback to "Unassigned Vulnerabilities"
	var fallback struct{ TeamID uuid.UUID }
	if err := db.Table("teams").Where("team_name = ?", "Unassigned Vulnerabilities").Select("team_id").First(&fallback).Error; err == nil {
		return fallback.TeamID
	}
	return uuid.Nil
}

func searchStaticCSVOwnershipByIP(IP string) string {
	file, err := os.Open("/app/internal/ownership/static_ownership_ip.csv")
	if err != nil {
		fmt.Println(err.Error())
		return ""
	}
	defer file.Close()

	r := csv.NewReader(file)
	_, err = r.Read()
	if err != nil {
		return ""
	}

	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil || len(record) < 2 {
			continue
		}
		if record[0] == IP {
			return record[1]
		}
	}
	return ""
}
