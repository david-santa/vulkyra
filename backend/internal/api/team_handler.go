package api

import (
	"net/http"

	"github.com/david-santa/vulkyra/backend/internal/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterTeamRoutes(r *gin.RouterGroup) {
	r.GET("/teams", getAllTeams)
}

func getAllTeams(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	teams, err := service.GetAllTeams(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, teams)
}
