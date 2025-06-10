package models

type Asset struct {
	ID      int    `json:"id" db:"id"`
	FQDN    string `json:"fqdn" db:"fqdn"`
	IP      string `json:"ip" db:"ip"`
	OwnerID int64  `json:"owner_id" db:"owner_id"`
}
