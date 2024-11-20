package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"server/handlers"
	"strings"

	"github.com/golang-jwt/jwt"
)

type contextKey string

const UserIDKey contextKey = "userID"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")

		if tokenString == "" {
			handlers.ErrorHandler(w, http.StatusUnauthorized, "Authorization token required")
			return
		}

		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return handlers.SECERET_KEY, nil
		})

		if err != nil || !token.Valid {
			handlers.ErrorHandler(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		claims, ok := token.Claims.(*jwt.StandardClaims)
		if !ok {
			handlers.ErrorHandler(w, http.StatusUnauthorized, "Invalid token Claims")
			return
		}
		userId := claims.Id
		ctx := context.WithValue(r.Context(), UserIDKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})

}
