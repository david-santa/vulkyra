package repository

import (
	"github.com/david-santa/vulkyra/backend/internal/models"
)

func InsertDummyUsers() error {
	dummy := []models.User{
		{Username: "ceo", Email: "ceo@vulkyra.com", PasswordHash: "c29tZXNhbHQ$mVD1NHum/J9ckmxeiPmzgMPN7e6rEgtQG3qGGIwuxR8", Role: "admin"},           //iamtheceo
		{Username: "david", Email: "david@vulkyra.com", PasswordHash: "YW5vdGhlcnNhbHQ$NH1X0CB9n/VN4Z4IpnlWKJtzNq+hMIjdvRYS4iMBWgY", Role: "analyst"}, //iamdavid
	}

	for _, u := range dummy {
		_, err := db.Exec("INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", u.Username, u.Email, u.PasswordHash, u.Role)
		if err != nil {
			return err
		}
	}
	return nil
}
