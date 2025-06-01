package service

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/repository"
)

func GetAllTeams() ([]models.Team, error) {
	return repository.GetAllTeams()
}
