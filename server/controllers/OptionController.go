package controllers

import "net/http"

func OptionController(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		// Add CORS headers for the preflight request
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, Accept, Origin")
		w.WriteHeader(http.StatusNoContent)
		return
	}
}
