package api

import (
	"net/http"

	"github.com/david-santa/vulkyra/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func RegisterNessusRoutes(r *gin.RouterGroup) {
	r.POST("/nessus/upload", uploadNessusFile)
}

func uploadNessusFile(c *gin.Context) {
	file, err := c.FormFile("nessusFile")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not open file"})
		return
	}
	defer f.Close()
	err = service.ProcessNessusUpload(f)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Nessus file processed successfully"})
}
