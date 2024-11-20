package api

import (
	"log"
	"net/http"
	initializers "server/Initializers"
	"server/routes"
	"sync"
)

var (
	router http.Handler
	once   sync.Once
)

// Initialize function will run once when the serverless function cold starts
func initializeApp() {
	once.Do(func() {
		// Check if DB_URI is set

		// Initialize the database
		if err := initializers.DatabaseInit(); err != nil {
			log.Printf("Error initializing database: %v", err)
		}

		// Set up the router
		router = routes.SetupRouter()
	})
}

// Handler is the entry point for the Vercel serverless function
func Handler(w http.ResponseWriter, r *http.Request) {
	// Initialize the app
	initializeApp()

	// Set common headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Serve the request
	if router != nil {
		router.ServeHTTP(w, r)
	} else {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
