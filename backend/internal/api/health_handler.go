package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterHealthRoutes(r *gin.Engine) {
	r.GET("/api/health", healthCheck)
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "Vulkyra API is running!"})
}
