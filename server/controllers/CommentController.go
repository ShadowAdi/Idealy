package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	initializers "server/Initializers"
	"server/handlers"
	"server/middlewares"
	"server/models"
	"strconv"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func GetAllComments(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	var comments []models.Comment

	// Extracting the startup ID from URL parameters
	startupIdStr := mux.Vars(r)["startupId"]
	startupId, err := strconv.Atoi(startupIdStr)
	if err != nil {
		http.Error(w, "Invalid startup ID format", http.StatusBadRequest)
		return
	}

	// Fetching comments for the given startup ID
	if err := initializers.DB.Where("startup_id = ?", startupId).Find(&comments).Error; err != nil {
		fmt.Printf("Error fetching comments: %v\n", err)
		http.Error(w, "Error fetching comments", http.StatusInternalServerError)
		return
	}

	// Responding with fetched comments
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Comments fetched successfully",
		"data":    comments,
	})
}
func PostComment(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}

	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert user ID from string to integer")
		return
	}

	var comment models.Comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	startupIdStr := mux.Vars(r)["startupId"]
	log.Printf("startupIdStr: %v", startupIdStr)

	startupId, err := strconv.Atoi(startupIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert Startup Id from string to integer")
		return
	}

	comment.StartupId = uint(startupId)
	comment.UserId = uint(userId)

	if comment.Content == "" {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Comment Content is required")
		return
	}

	if err := initializers.DB.Create(&comment).Error; err != nil {
		log.Printf("Error creating Comment: %v", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error creating Comment")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Comment created successfully",
		"data":    comment,
	})
}

func DeleteComment(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	// Set CORS headers if needed
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json") // Set this early as it's used in all responses
	fmt.Println("hii trying to delete comment")
	// Handle preflight OPTIONS request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		fmt.Print(err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert user ID from string to integer")
		return
	}

	commentIdStr := mux.Vars(r)["commentId"]
	commentId, err := strconv.Atoi(commentIdStr)
	if err != nil {
		fmt.Print(err)
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid comment ID")
		return
	}

	var comment models.Comment
	result := initializers.DB.First(&comment, commentId) // Changed Find to First
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			handlers.ErrorHandler(w, http.StatusNotFound, "Comment not found")
			return
		}
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to find comment")
		return
	}

	if comment.UserId != uint(userId) {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "You can only delete your own comment")
		return
	}

	if err := initializers.DB.Delete(&comment).Error; err != nil {
		fmt.Print(err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to delete comment")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Comment deleted successfully",
	})
}

func PutComment(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert user ID from string to integer")
		return
	}

	commentIdStr := mux.Vars(r)["commentId"]

	commentId, err := strconv.Atoi(commentIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert Comment Id from string to integer")
		return
	}

	var comment models.Comment
	if err := initializers.DB.Find(&comment, commentId).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to Find Comment")
		return
	}

	if comment.UserId != uint(userId) {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "You can delete only your commebt")
		return
	}

	var commentData handlers.CommentStructData
	if err := json.NewDecoder(r.Body).Decode(&commentData); err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Invalid request body")
		return
	}

	updateData := map[string]interface{}{}

	if commentData.Content != "" {
		updateData["content"] = commentData.Content
	}

	if err := initializers.DB.Model(&models.Comment{}).Where("id = ?", commentId).Updates(updateData).Error; err != nil {
		fmt.Printf("%s\n", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to update comment")
		return
	}

	// Send success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Comment updated successfully"})
}
