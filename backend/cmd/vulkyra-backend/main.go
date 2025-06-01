package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq" // <-- This is required!

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

	// Create table if not exists (for quick dev/demo)
	db.Exec(`CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        fqdn VARCHAR(255),
        ip VARCHAR(50)
    )`)

	db.Exec(`CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    parent_id BIGINT NOT NULL
	)`)

	repository.InsertDummyAssets()
	repository.InsertDummyTeams()

	r := gin.Default()
	r.Use(cors.Default())

	RegisterAllRoutes(r)

	r.Run(":8080")
}
