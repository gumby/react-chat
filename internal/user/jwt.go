package user

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// jwtKey is used to create the JWT signature
var jwtKey = []byte("secrets_of_the_universe")

// Credentials will read the username and password from the JWT body
type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

type claims struct {
	Username string `json:"user"`
	jwt.RegisteredClaims
}

func (c Credentials) CreateToken() (signedToken string, err error) {
	expire := time.Now().Add(8 * time.Hour)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims{
		Username: c.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{Time: expire},
			NotBefore: &jwt.NumericDate{Time: time.Now()},
		},
	})
	signedToken, err = token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return signedToken, nil
}
