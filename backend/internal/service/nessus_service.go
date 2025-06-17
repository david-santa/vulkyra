package service

import (
	"io"

	"github.com/david-santa/vulkyra/backend/internal/parsers"
)

func ProcessNessusUpload(reader io.Reader) error {
	return parsers.ParseAndInsertFromReader(reader)
}
