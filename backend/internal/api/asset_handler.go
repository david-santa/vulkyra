package api

import (
	"net/http"

	"github.com/david-santa/vulkyra/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func RegisterAssetRoutes(r *gin.Engine) {
	r.GET("/api/assets", getAllAssets)
}

func getAllAssets(c *gin.Context) {
	assets, err := service.GetAllAssets()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, assets)
}
