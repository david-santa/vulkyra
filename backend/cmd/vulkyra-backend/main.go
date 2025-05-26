package main

import (
	"database/sql"
	"log"

	"github.com/david-santa/vulkyra/backend/internal/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db, err := sql.Open("postgres", "host=db user=vulkyra password=secretpassword dbname=vulkyra sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	repository.SetDB(db)

	// Assign the DB instance to repository
	repository.SetDB(db)

	// Create table if not exists (for quick dev/demo)
	db.Exec(`CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        fqdn VARCHAR(255),
        ip VARCHAR(50)
    )`)

	repository.InsertDummyAssets()

	r := gin.Default()
	r.Use(cors.Default())

	RegisterAllRoutes(r)

	r.Run(":8080")
}
