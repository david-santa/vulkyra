package main

import (
	"log"
	"os"

	"github.com/david-santa/vulkyra/backend/cmd/auth"
	"github.com/david-santa/vulkyra/backend/internal/models"
	"github.com/david-santa/vulkyra/backend/internal/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Use env or config for real-world apps!
	dsn := "host=db user=vulkyra password=secretpassword dbname=vulkyra sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	db.Migrator().DropTable(&models.Asset{}, &models.Team{}, &models.User{}, &models.Vulnerability{})

	// Auto-migrate all models (creates tables if not exist, updates fields)
	if err := db.AutoMigrate(
		&models.Team{},
		&models.Asset{},
		&models.User{},
		&models.Vulnerability{},
	); err != nil {
		log.Fatal("failed to migrate database: ", err)
	}

	repository.InsertDummyUsers(db)
	repository.InsertDummyAssets(db)
	repository.InsertDummyTeams(db)

	r := gin.Default()

	// Attach the GORM DB to Gin context so you can use it in handlers
	r.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	// Enable CORS for all Methods and Headers
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost", "http://localhost:8080", "http://localhost:5432"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.POST("/api/login", auth.LoginHandler)
	protected := r.Group("/api")
	protected.Use(auth.AuthMiddleware())

	RegisterAllRoutes(r, protected) // You must update your routes/handlers to use GORM DB

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
