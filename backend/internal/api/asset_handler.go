package api

import (
	"net/http"
	"strconv"

	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func RegisterAssetRoutes(r *gin.RouterGroup) {
	r.GET("/assets", getAllAssets)
	r.GET("/assets/:id", getAssetByID)
	r.PUT("/assets/:id", updateAsset)
}

func getAllAssets(c *gin.Context) {
	assets, err := service.GetAllAssets()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, assets)
}

func getAssetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid asset ID"})
		return
	}
	asset, err := service.GetAssetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found"})
		return
	}
	c.JSON(http.StatusOK, asset)
}

func updateAsset(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid asset ID"})
		return
	}
	var input models.Asset
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	asset, err := service.UpdateAsset(id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, asset)
}
