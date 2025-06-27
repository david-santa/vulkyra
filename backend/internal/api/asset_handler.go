package api

import (
	"net/http"

	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterAssetRoutes(r *gin.RouterGroup) {
	r.GET("/assets", getAllAssets)
	r.GET("/assets/:id", getAssetByID)
	r.PUT("/assets/:id", updateAsset)
}

func getAllAssets(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	assets, err := service.GetAllAssets(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, assets)
}

func getAssetByID(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id") // for UUIDs, use string
	asset, err := service.GetAssetByID(db, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found"})
		return
	}
	c.JSON(http.StatusOK, asset)
}

func updateAsset(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id") // for UUIDs, use string
	var input models.Asset
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	asset, err := service.UpdateAsset(db, id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, asset)
}
