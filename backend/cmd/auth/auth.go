package auth

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("very_secret_key") // Use env var in real apps

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func LoginHandler(c *gin.Context) {
	db := c.MustGet("db").(*sql.DB)

	var creds Credentials
	var role string
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	var storedHash string

	err := db.QueryRow("SELECT password_hash, role FROM users WHERE username=$1", creds.Username).Scan(&storedHash, &role)
	if err == sql.ErrNoRows {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Server error"})
		return
	}

	if !verifyPassword(creds.Password, storedHash) {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &Claims{
		Username: creds.Username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing auth header"})
			return
		}
		var tokenStr string
		// Expect header like: Bearer <token>
		_, err := fmt.Sscanf(authHeader, "Bearer %s", &tokenStr)
		if err != nil || tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid auth header"})
			return
		}
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		// Save username, role in context
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)
		c.Next()
	}
}
