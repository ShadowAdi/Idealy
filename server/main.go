package main

import (
	"log"
	"net/http"
	"server/api"
)

func main() {
	// Start the server, using the Handler defined in api package
	http.HandleFunc("/", api.Handler) // Handle incoming requests with the api.Handler

	// Log the server startup
	log.Println("Starting server on :8080...")

	// Start listening on port 8080
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
