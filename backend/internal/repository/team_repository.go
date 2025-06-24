package repository

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// GetAllTeams returns all teams from DB
func GetAllTeams(db *gorm.DB) ([]models.Team, error) {
	var teams []models.Team
	err := db.Find(&teams).Error
	return teams, err
}

func InsertDummyTeams(db *gorm.DB) error {
	// Generate all UUIDs first (index 0 unused, for easier referencing)
	teamIDs := make([]uuid.UUID, 15)
	for i := 1; i <= 14; i++ {
		teamIDs[i] = uuid.New()
	}

	// Set nil where no parent exists
	dummy := []models.Team{
		{TeamID: teamIDs[1], TeamName: "Unassigned Vulnerabilities", TeamEmail: "noreply@vulkyra.com", ParentID: nil},
		{TeamID: teamIDs[2], TeamName: "Vulkyra CEO", TeamEmail: "ceo@vulkyra.com", ParentID: nil},
		{TeamID: teamIDs[3], TeamName: "Security", TeamEmail: "security@vulkyra.com", ParentID: &teamIDs[2]},
		{TeamID: teamIDs[4], TeamName: "Engineering", TeamEmail: "engineering@vulkyra.com", ParentID: &teamIDs[2]},
		{TeamID: teamIDs[5], TeamName: "HR", TeamEmail: "hr@vulkyra.com", ParentID: &teamIDs[2]},
		{TeamID: teamIDs[6], TeamName: "Software Engineering", TeamEmail: "swe@vulkyra.com", ParentID: &teamIDs[4]},
		{TeamID: teamIDs[7], TeamName: "Vulnerability Management", TeamEmail: "vm@vulkyra.com", ParentID: &teamIDs[3]},
		{TeamID: teamIDs[8], TeamName: "Penetration Testing", TeamEmail: "pentest@vulkyra.com", ParentID: &teamIDs[3]},
		{TeamID: teamIDs[9], TeamName: "Risk", TeamEmail: "risk@vulkyra.com", ParentID: &teamIDs[2]},
		{TeamID: teamIDs[10], TeamName: "Security Risk and Compliance", TeamEmail: "securityrnc@vulkyra.com", ParentID: &teamIDs[9]},
		{TeamID: teamIDs[11], TeamName: "Security Operations Center", TeamEmail: "soc@vulkyra.com", ParentID: &teamIDs[3]},
		{TeamID: teamIDs[12], TeamName: "SOC L1", TeamEmail: "socl1@vulkyra.com", ParentID: &teamIDs[11]},
		{TeamID: teamIDs[13], TeamName: "SOC L2", TeamEmail: "socl2@vulkyra.com", ParentID: &teamIDs[11]},
		{TeamID: teamIDs[14], TeamName: "Backend Engineering", TeamEmail: "backend@vulkyra.com", ParentID: &teamIDs[6]},
	}
	return db.Create(&dummy).Error
}
