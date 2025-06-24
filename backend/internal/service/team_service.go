package service

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/repository"
	"gorm.io/gorm"
)

// GetAllTeams fetches all teams using the given GORM DB instance
func GetAllTeams(db *gorm.DB) ([]models.Team, error) {
	return repository.GetAllTeams(db)
}
