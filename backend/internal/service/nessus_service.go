package service

import (
	"io"

	"github.com/david-santa/vulkyra/backend/internal/parsers"
	"gorm.io/gorm"
)

// ProcessNessusUpload parses and inserts Nessus data using GORM DB
func ProcessNessusUpload(db *gorm.DB, reader io.Reader) error {
	return parsers.ParseAndInsertFromReader(db, reader)
}
