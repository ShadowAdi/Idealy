package controllers

import (
	"encoding/json"
	"net/http"
	initializers "server/Initializers"
	"server/handlers"
	"server/middlewares"
	"server/models"
	"strconv"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func CreateCategory(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	_, err := strconv.Atoi(userIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert user ID from string to integer")
		return
	}

	var category models.Category

	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if category.Name == "" {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Category name is required")
		return
	}

	var existingCategory models.Category
	result := initializers.DB.Where("name = ?", category.Name).First(&existingCategory)
	if result.Error == nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Name already taken")
		return
	} else if result.Error != gorm.ErrRecordNotFound {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database error occurred")
		return
	}

	if err := initializers.DB.Create(&category).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error creating category")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Category created successfully",
		"data":    category,
	})
}

func GetAllCategory(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}

	var category []models.Category

	if err := initializers.DB.Find(&category).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching category")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Category get successfully",
		"data":    category,
	})
}

func GetCategory(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}

	var category models.Category

	categoryId := mux.Vars(r)["id"]

	if err := initializers.DB.Find(&category, categoryId).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching category")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Category get successfully",
		"data":    category,
	})
}
