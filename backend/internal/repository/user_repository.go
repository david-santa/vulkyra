package repository

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
	"gorm.io/gorm"
)

func InsertDummyUsers(db *gorm.DB) error {
	dummyUsers := []models.User{
		{Username: "ceo", Email: "ceo@vulkyra.com", PasswordHash: "c29tZXNhbHQ$mVD1NHum/J9ckmxeiPmzgMPN7e6rEgtQG3qGGIwuxR8", Role: "admin"},           //iamtheceo
		{Username: "david", Email: "david@vulkyra.com", PasswordHash: "YW5vdGhlcnNhbHQ$NH1X0CB9n/VN4Z4IpnlWKJtzNq+hMIjdvRYS4iMBWgY", Role: "analyst"}, //iamdavid
	}
	return db.Create(&dummyUsers).Error
}
