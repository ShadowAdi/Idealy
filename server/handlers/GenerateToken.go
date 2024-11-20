package handlers

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

var Key = os.Getenv("SECERET_KEY")
var SECERET_KEY = []byte(Key)

func GenerateToken(userID uint) (string, error) {
	claims := &jwt.StandardClaims{
		Id:        fmt.Sprintf("%d", userID),
		ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
		Issuer:    "server",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(SECERET_KEY)
}
