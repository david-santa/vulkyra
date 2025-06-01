package repository

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
)

// No: var db *sql.DB   (already declared in this package!)

func GetAllTeams() ([]models.Team, error) {
	rows, err := db.Query("SELECT id, name, email, parent_id FROM teams")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []models.Team
	for rows.Next() {
		var t models.Team
		if err := rows.Scan(&t.ID, &t.Name, &t.Email, &t.ParentID); err != nil {
			return nil, err
		}
		teams = append(teams, t)
	}
	return teams, nil
}

func InsertDummyTeams() error {
	dummy := []models.Team{
		{ID: 1, Name: "Vulkyra CEO", Email: "ceo@vulkyra.com", ParentID: 0},
		{ID: 2, Name: "Security", Email: "security@vulkyra.com", ParentID: 1},
		{ID: 3, Name: "Engineering", Email: "engineering@vulkyra.com", ParentID: 1},
		{ID: 4, Name: "HR", Email: "hr@vulkyra.com", ParentID: 1},
		{ID: 5, Name: "Software Engineering", Email: "swe@vulkyra.com", ParentID: 3},
		{ID: 6, Name: "Vulnerability Management", Email: "vm@vulkyra.com", ParentID: 2},
		{ID: 7, Name: "Penetration Testing", Email: "pentest@vulkyra.com", ParentID: 2},
		{ID: 8, Name: "Risk", Email: "risk@vulkyra.com", ParentID: 1},
		{ID: 9, Name: "Security Risk and Compliance", Email: "securityrnc@vulkyra.com", ParentID: 8},
		{ID: 10, Name: "Security Operations Center", Email: "soc@vulkyra.com", ParentID: 2},
		{ID: 11, Name: "SOC L1", Email: "socl1@vulkyra.com", ParentID: 10},
		{ID: 12, Name: "SOC L2", Email: "socl2@vulkyra.com", ParentID: 10},
		{ID: 13, Name: "Backend Engineering", Email: "backend@vulkyra.com", ParentID: 5},
	}
	for _, t := range dummy {
		_, err := db.Exec("INSERT INTO teams (name, email, parent_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", t.Name, t.Email, t.ParentID)
		if err != nil {
			return err
		}
	}
	return nil
}
