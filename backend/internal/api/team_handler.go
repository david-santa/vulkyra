package api

import (
	"net/http"

	"github.com/david-santa/vulkyra/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func RegisterTeamRoutes(r *gin.RouterGroup) {
	r.GET("/teams", getAllTeams)
}

func getAllTeams(c *gin.Context) {
	teams, err := service.GetAllTeams()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, teams)
}
