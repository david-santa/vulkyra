package main

import (
	"github.com/david-santa/vulkyra/backend/internal/api"

	"github.com/gin-gonic/gin"
)

func RegisterAllRoutes(r *gin.Engine, protected *gin.RouterGroup) {
	api.RegisterHealthRoutes(protected)
	api.RegisterAssetRoutes(protected)
	api.RegisterTeamRoutes(protected)
	api.RegisterMeRoutes(protected)
	api.RegisterNessusRoutes(protected)
	api.RegisterVulnerabilitiesRoutes(protected)
}
