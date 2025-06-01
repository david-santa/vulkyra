package main

import (
	"github.com/david-santa/vulkyra/backend/internal/api"

	"github.com/gin-gonic/gin"
)

func RegisterAllRoutes(r *gin.Engine) {
	api.RegisterHealthRoutes(r)
	api.RegisterAssetRoutes(r)
	api.RegisterTeamRoutes(r)
}
