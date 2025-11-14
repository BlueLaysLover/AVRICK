package middleware

import (
	"context"
	"log"
	"net/http"
	"strings"

	data "avrick.com/database"
)

func FirebaseAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Get auth header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		// Extract token: remove "Bearer "
		idToken := strings.TrimPrefix(authHeader, "Bearer ")
		idToken = strings.TrimSpace(idToken)

		// Create Firebase auth client
		authClient, err := data.App.Auth(r.Context())
		if err != nil {
			log.Println("Error creating Firebase auth client:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Verify ID token
		token, err := authClient.VerifyIDToken(r.Context(), idToken)
		if err != nil {
			log.Println("Invalid Firebase token:", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Extract UID + email from token claims
		uid := token.UID
		email, _ := token.Claims["email"].(string)

		// Add values to context
		ctx := context.WithValue(r.Context(), "uid", uid)
		ctx = context.WithValue(ctx, "userEmail", email)

		// Pass request to next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
