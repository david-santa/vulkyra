package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq" // <-- This is required!

	"github.com/david-santa/vulkyra/backend/cmd/auth"
	"github.com/david-santa/vulkyra/backend/internal/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db, err := sql.Open("postgres", "host=db user=vulkyra password=secretpassword dbname=vulkyra sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	// Assign the DB instance to repository
	repository.SetDB(db)

	db.Exec("DROP TABLE teams CASCADE")
	db.Exec("DROP TABLE assets CASCADE")
	db.Exec("DROP TABLE users")
	db.Exec("DROP TABLE vulnerabilities")

	// Create table if not exists (for quick dev/demo)
	db.Exec(`CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        fqdn VARCHAR(255),
        ip VARCHAR(50),
		owner_id BIGINT
    )`)

	db.Exec(`CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    parent_id BIGINT NOT NULL
	)`)

	db.Exec(`CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	role VARCHAR(255)
	)`)

	db.Exec(`CREATE TABLE IF NOT EXISTS vulnerabilities (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id),
    plugin_id INTEGER,
    plugin_name TEXT,
    plugin_family TEXT,
    port INTEGER,
    protocol TEXT,
    service TEXT,
    severity INTEGER,
    risk_factor TEXT,
    description TEXT,
    solution TEXT,
    output TEXT,
    cves TEXT[],
    cvss_score FLOAT,
    refs TEXT[],
	owner_id INT REFERENCES teams(id)
	);`)

	repository.InsertDummyAssets()
	repository.InsertDummyTeams()
	repository.InsertDummyUsers()

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	// Enable CORS for all Methods and Headers
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost", "http://localhost:8080, http://localhost:5432"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.POST("/api/login", auth.LoginHandler)
	protected := r.Group("/api")
	protected.Use(auth.AuthMiddleware())

	RegisterAllRoutes(r, protected)

	r.Run(":8080")
}
