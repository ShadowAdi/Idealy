package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

type ErrorResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func ErrorHandler(w http.ResponseWriter, statusCode int, message string) {
	w.WriteHeader(statusCode)
	errorResponse := ErrorResponse{
		StatusCode: statusCode,
		Message:    message,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(errorResponse); err != nil {
		log.Printf("Error encoding response: %v", err)
	}

}
