package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	initializers "server/Initializers"
	"server/handlers"
	"server/middlewares"
	"server/models"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func GetAllStartup(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	var startups []models.Startup

	query := r.URL.Query()
	startupName := strings.TrimSpace(query.Get("startupName"))
	categoryName := strings.TrimSpace(query.Get("categoryName"))
	sortBy := query.Get("sortBy")

	db := initializers.DB

	// Build the query dynamically
	if startupName != "" && categoryName != "" {
		// When both filters are present
		db = db.Joins("JOIN categories ON categories.id = startups.category_id").
			Where("startups.name ILIKE ? AND categories.name ILIKE ?",
				"%"+startupName+"%", "%"+categoryName+"%")
	} else {
		// When only one filter is present
		if startupName != "" {
			db = db.Where("startups.name ILIKE ?", "%"+startupName+"%")
		}
		if categoryName != "" {
			db = db.Joins("JOIN categories ON categories.id = startups.category_id").
				Where("categories.name ILIKE ?", "%"+categoryName+"%")
		}
	}

	// Apply sorting
	switch sortBy {
	case "likes":
		db = db.Order("array_length(likes, 1) DESC")
	case "views":
		db = db.Order("views DESC")
	case "dislikes":
		db = db.Order("array_length(dislikes, 1) DESC")
	default:
		db = db.Order("startups.id ASC")
	}

	// Preload associations
	if err := db.Preload("User").Preload("Category").Find(&startups).Error; err != nil {
		log.Printf("Error fetching startups: %v", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching Startups")
		return
	}

	// Return results
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Startups fetched successfully",
		"data":    startups,
	})
}

func CreateStartup(w http.ResponseWriter, r *http.Request) {
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

	var startup models.Startup
	if err := json.NewDecoder(r.Body).Decode(&startup); err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	startup.UserId = uint(userId)

	if startup.Name == "" {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Startup name is required")
		return
	}

	if startup.Pitch == "" {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Pitch is required")
		return
	}

	if startup.CategoryID == 0 {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Category is required")
		return
	}

	if err := handlers.StartupNameCheck(startup.Name); err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := initializers.DB.Create(&startup).Error; err != nil {
		fmt.Printf("Error creating startup: %v\n", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error creating startup")
		return
	}

	response := handlers.StartupResponse{
		ID:             startup.ID,
		CreatedAt:      startup.CreatedAt,
		UpdatedAt:      startup.UpdatedAt,
		UserID:         startup.UserId,
		Name:           startup.Name,
		Pitch:          startup.Pitch,
		CategoryID:     startup.CategoryID,
		ImageURL:       startup.ImageURL,
		IsActive:       startup.IsActive,
		SocialLinks:    startup.SocialLinks,
		Views:          startup.Views,
		Likes:          startup.Likes,
		Dislikes:       startup.Dislikes,
		FundingStage:   startup.FundingStage,
		TargetAudience: startup.TargetAudience,
	}
	// Send success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Startup created successfully",
		"data":    response,
	})
}

func GetStartup(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	var startup models.Startup

	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	// Combine queries into one
	if err := initializers.DB.Preload("User").Preload("Category").First(&startup, id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "Startup not found")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Startup fetched successfully",
		"data":    startup,
	})
}
func DeleteStartup(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
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

	id := mux.Vars(r)["id"]

	var GetStartupById models.Startup

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert user ID from string to integer")
		return
	}

	if err := initializers.DB.Find(&GetStartupById, id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching Startup")
		return
	}

	if GetStartupById.UserId != uint(userId) {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "Error You can only delete your ideas")
		return
	}

	var startup models.Startup

	db := initializers.DB

	// Preload User, Category, and Tags associations
	if err := db.Find(&startup, id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error deleting Startup")
		return
	}

	db.Delete(&startup)

	// Return results
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Startup deleted successfully",
	})
}

func UpdateStartup(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	// Get user ID from context
	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	// Get startup ID from URL
	startupId := mux.Vars(r)["id"]

	// Convert user ID to integer
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert user ID from string to integer")
		return
	}

	// Find the existing startup
	var existingStartup models.Startup
	if err := initializers.DB.First(&existingStartup, startupId).Error; err != nil {
		fmt.Printf("%s", err)
		if err == gorm.ErrRecordNotFound {
			handlers.ErrorHandler(w, http.StatusNotFound, "Startup not found")
		} else {
			handlers.ErrorHandler(w, http.StatusInternalServerError, fmt.Sprintf("Error fetching startup: %v", err))
		}
		return
	}

	// Check if the user owns this startup
	if existingStartup.UserId != uint(userId) {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "You can only update your own ideas")
		return
	}

	// Decode the update request
	var updatedStartup handlers.StartupUpdatedData
	if err := json.NewDecoder(r.Body).Decode(&updatedStartup); err != nil {
		fmt.Printf("%s", err)
		fmt.Print(updatedStartup)
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Begin transaction
	tx := initializers.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Create map for updates
	updateData := map[string]interface{}{}
	if updatedStartup.Name != "" {
		updateData["name"] = updatedStartup.Name
	}
	if updatedStartup.FundingStage != "" {
		updateData["funding_stage"] = updatedStartup.FundingStage
	}
	if updatedStartup.Pitch != "" {
		updateData["pitch"] = updatedStartup.Pitch
	}
	if updatedStartup.TargetAudience != "" {
		updateData["target_audience"] = updatedStartup.TargetAudience
	}
	if updatedStartup.ImageURL != "" {
		updateData["image_url"] = updatedStartup.ImageURL
	}
	if updatedStartup.SocialLinks != nil {
		socialLinksMap := make(map[string]string)
		for _, link := range updatedStartup.SocialLinks {
			socialLinksMap[link.Platform] = link.URL
		}
		updateData["social_links"] = socialLinksMap
	}
	if updatedStartup.CategoryID > 0 {
		var category models.Category
		if err := initializers.DB.First(&category, updatedStartup.CategoryID).Error; err != nil {
			tx.Rollback()
			handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid category ID")
			return
		}
		updateData["category_id"] = updatedStartup.CategoryID
	}
	if r.FormValue("is_active") != "" {
		updateData["is_active"] = updatedStartup.IsActive
	}

	// Execute the update
	if err := tx.Model(&existingStartup).Updates(updateData).Error; err != nil {
		tx.Rollback()
		handlers.ErrorHandler(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update startup: %v", err))
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, fmt.Sprintf("Failed to commit changes: %v", err))
		return
	}

	// Send success response with updated data
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Startup updated successfully",
		"startup": existingStartup,
	})
}

func LikeStartup(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	_, err := strconv.Atoi(userIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Invalid user ID format")
		return
	}

	startupId := mux.Vars(r)["startupId"]
	if startupId == "" {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Startup ID is required")
		return
	}

	var startupUserLiked models.Startup
	if err := initializers.DB.First(&startupUserLiked, startupId).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "Startup not found")
		return
	}

	// Remove user from dislikes list if present
	for i, userWhoDisliked := range startupUserLiked.Dislikes {
		if userWhoDisliked == userIdStr {
			startupUserLiked.Dislikes = append(startupUserLiked.Dislikes[:i], startupUserLiked.Dislikes[i+1:]...)
			break
		}
	}

	// Toggle like
	liked := false
	for i, userWhoLiked := range startupUserLiked.Likes {
		if userWhoLiked == userIdStr {
			startupUserLiked.Likes = append(startupUserLiked.Likes[:i], startupUserLiked.Likes[i+1:]...)
			liked = true
			break
		}
	}

	if !liked {
		startupUserLiked.Likes = append(startupUserLiked.Likes, userIdStr)
	}

	// Save updated startup
	if err := initializers.DB.Save(&startupUserLiked).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to update startup")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "Like status updated successfully",
		"liked":    !liked,
		"likes":    len(startupUserLiked.Likes),
		"dislikes": len(startupUserLiked.Dislikes),
	})
}

func DislikeStartup(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	userIDStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	_, err := strconv.Atoi(userIDStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Invalid user ID format")
		return
	}

	startupID := mux.Vars(r)["startupId"]
	if startupID == "" {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Startup ID is required")
		return
	}

	var startup models.Startup
	if err := initializers.DB.First(&startup, startupID).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "Startup not found")
		return
	}

	// Remove user from likes list if present
	for i, likedUserID := range startup.Likes {
		if likedUserID == userIDStr {
			startup.Likes = append(startup.Likes[:i], startup.Likes[i+1:]...)
			break
		}
	}

	// Toggle dislike
	disliked := false
	for i, dislikedUserID := range startup.Dislikes {
		if dislikedUserID == userIDStr {
			startup.Dislikes = append(startup.Dislikes[:i], startup.Dislikes[i+1:]...)
			disliked = true
			break
		}
	}

	if !disliked {
		startup.Dislikes = append(startup.Dislikes, userIDStr)
	}

	// Save updated startup
	if err := initializers.DB.Save(&startup).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to update startup")
		return
	}

	response := map[string]interface{}{
		"message":  "Dislike status updated successfully",
		"disliked": !disliked,
		"likes":    len(startup.Likes),
		"dislikes": len(startup.Dislikes),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func AddViewStartup(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}

	id := mux.Vars(r)["id"]

	var GetStartupById models.Startup

	if err := initializers.DB.First(&GetStartupById, id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching Startup")
		return
	}

	GetStartupById.Views += 1

	if err := initializers.DB.Save(&GetStartupById).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error updating views")
		return
	}

	// Send success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "View count updated successfully", "view_count": GetStartupById.Views})
}

func GetStartupsByUserId(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	id := mux.Vars(r)["userId"]
	var startups []models.Startup

	var userModel models.User
	if err := initializers.DB.First(&userModel, id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "User not found")
		return
	}

	query := r.URL.Query()
	sortBy := query.Get("sort_by")
	startupName := query.Get("startupname")
	categoryName := query.Get("categoryName")

	db := initializers.DB.Where("user_id = ?", id)

	// Filter by startup name (case-insensitive)
	if startupName != "" {
		db = db.Where("name ILIKE ?", "%"+startupName+"%")
	}

	// Filter by category name (case-insensitive)
	if categoryName != "" {
		db = db.Joins("JOIN categories ON categories.id = startups.category_id").
			Where("categories.name ILIKE ?", "%"+categoryName+"%")
	}

	// Sorting options
	switch sortBy {
	case "likes":
		db = db.Order("array_length(likes, 1) DESC") // Order by count of likes
	case "views":
		db = db.Order("views DESC")
	case "dislikes":
		db = db.Order("array_length(dislikes, 1) DESC") // Order by count of dislikes
	default:
		db = db.Order("id ASC")
	}

	// Preload User, Category, and Tags associations
	if err := db.Preload("User").Preload("Category").Find(&startups).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching Startups")
		return
	}

	// Return results
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Startups fetched successfully",
		"data":    startups,
	})
}
