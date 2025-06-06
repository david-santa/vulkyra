package api

import (
	"github.com/david-santa/vulkyra/backend/cmd/auth"
	"github.com/gin-gonic/gin"
)

func RegisterMeRoutes(r *gin.RouterGroup) {
	r.GET("/me", auth.AuthMiddleware(), getMeData)
}

func getMeData(c *gin.Context) {
	username := c.GetString("username")
	role := c.GetString("role")
	c.JSON(200, gin.H{
		"username": username,
		"role":     role,
	})
}
