package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	initializers "server/Initializers"
	"server/handlers"
	"server/middlewares"
	"server/models"
	"sort"
	"strconv"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	fmt.Print(initializers.DB)
	var user models.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		fmt.Printf("%s", err)
		handlers.ErrorHandler(w, http.StatusBadRequest, "Response Body Not Given")
		return
	}
	fmt.Printf("%s", user.Username)
	fmt.Printf("%s", user.Password)
	fmt.Printf("%s", user.Email)

	if user.Password == "" || user.Username == "" || user.Email == "" {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Credentials Not Given")
		return
	}

	var existingUser models.User
	if err := initializers.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		fmt.Printf("%s", err)
		handlers.ErrorHandler(w, http.StatusBadRequest, "Email already taken")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("%s", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Hashing Password")
		return
	}
	user.Password = string(hashedPassword)

	if err := initializers.DB.Create(&user).Error; err != nil {
		fmt.Printf("%s", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Creating User")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "User Created", "Data": user.ToResponse(), "Ideas": user.Ideas})
}

func Login(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	var existingUser models.User
	if err := initializers.DB.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "Email not found")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(user.Password)); err != nil {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	token, err := handlers.GenerateToken(existingUser.ID)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func VerifyToken(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}

	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "Authorization token required")
		return
	}

	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return handlers.SECERET_KEY, nil
	})

	if err != nil || !token.Valid {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "Invalid or expired token")
		return
	}

	claims, ok := token.Claims.(*jwt.StandardClaims)
	if !ok {
		handlers.ErrorHandler(w, http.StatusUnauthorized, "Invalid token claims")
		return
	}

	var user models.User
	if err := initializers.DB.First(&user, claims.Id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "User not found")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"Data":  user.ToResponse(),
		"Ideas": user.Ideas,
	})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Successfully logged out"})
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	var users []models.User
	query := r.URL.Query()
	sortBy := query.Get("sort_by")
	usernameFilter := query.Get("username")
	emailFilter := query.Get("email")

	db := initializers.DB

	// Apply filters
	if usernameFilter != "" {
		db = db.Where("username ILIKE ?", "%"+usernameFilter+"%")
	}
	if emailFilter != "" {
		db = db.Where("email ILIKE ?", "%"+emailFilter+"%")
	}

	// First, fetch all users with their relationships
	if err := db.Preload("Ideas").Find(&users).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching Users")
		return
	}

	// Sort the results in memory if needed
	switch sortBy {
	case "followers":
		sort.Slice(users, func(i, j int) bool {
			return len(users[i].Followers) > len(users[j].Followers)
		})
	case "startup_count":
		sort.Slice(users, func(i, j int) bool {
			return len(users[i].Ideas) > len(users[j].Ideas)
		})
	}

	// Convert to response format
	var userResponses []map[string]interface{}
	for _, user := range users {
		userResponses = append(userResponses, user.ToResponse())
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Users Fetched Successfully",
		"data":    userResponses,
	})
}
func GetUser(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	var user models.User

	id := mux.Vars(r)["id"]

	db := initializers.DB

	if err := db.Preload("Ideas").Find(&user, id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Error Fetching Users")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User Fetched Successfully",
		"data":    &user,
	})
}

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	userId, ok := r.Context().Value(middlewares.UserIDKey).(string)

	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	fmt.Printf("User id this %s\n", userId)

	var updatedUser handlers.UpdateUser
	if err := json.NewDecoder(r.Body).Decode(&updatedUser); err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Invalid request body")
		return
	}

	fmt.Printf("%s", updatedUser.Bio)

	updateData := map[string]interface{}{}

	if updatedUser.Username != "" {
		updateData["username"] = updatedUser.Username
	}
	if updatedUser.Bio != "" {
		updateData["bio"] = updatedUser.Bio
	}
	if updatedUser.Profile != "" {
		updateData["profile"] = updatedUser.Profile
	}
	if updatedUser.SocialLinks != nil {
		updateData["social_links"] = updatedUser.SocialLinks
	}
	if updatedUser.Location != "" {
		updateData["location"] = updatedUser.Location
	}

	if err := initializers.DB.Model(&models.User{}).Where("id = ?", userId).Updates(updateData).Error; err != nil {
		fmt.Printf("%s\n", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to update profile")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
}

func DeleteProfile(w http.ResponseWriter, r *http.Request) {
	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)

	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	userId, err := strconv.Atoi(userIdStr) // Convert string to int
	if err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Invalid user ID format")
		return
	}

	if err := initializers.DB.Delete(&models.User{}, userId).Error; err != nil {
		fmt.Printf("%s\n", err)
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to delete profile")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile Delete successfully"})
}

func FollowUser(w http.ResponseWriter, r *http.Request) {
	if initializers.DB == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Database connection error")
		return
	}
	userIdStr, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	Target_user_idStr := mux.Vars(r)["target_user_id"]

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User ID Not converting to int")
		return
	}

	target_user_id, err := strconv.Atoi(Target_user_idStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Target User ID Not converting to int")
		return
	}

	if Target_user_idStr == userIdStr {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "You Cant Follow Yourself")
		return
	}

	var user models.User
	if err := initializers.DB.First(&user, userId).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "User Not Exist")
		return
	}

	// Initialize Following slice if nil
	if user.Following == nil {
		user.Following = make([]uint, 0)
	}

	// Check if already following
	for _, following := range user.Following {
		if following == uint(target_user_id) {
			handlers.ErrorHandler(w, http.StatusBadRequest, "You already Follow the target")
			return
		}
	}

	user.Following = append(user.Following, uint(target_user_id))

	if err := initializers.DB.Save(&user).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Failed to update following list")
		return
	}

	var targetUser models.User
	if err := initializers.DB.First(&targetUser, target_user_id).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusNotFound, "Target User Not Exist")
		return
	}

	// Initialize Followers slice if nil
	if targetUser.Followers == nil {
		targetUser.Followers = make([]uint, 0)
	}

	// Check if already in followers
	for _, followers := range targetUser.Followers {
		if followers == user.ID {
			handlers.ErrorHandler(w, http.StatusBadRequest, "User already on your follow list")
			return
		}
	}

	targetUser.Followers = append(targetUser.Followers, user.ID)

	if err := initializers.DB.Save(&targetUser).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusBadRequest, "Failed to update Followers List")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":        "Followed user successfully",
		"user_following": user.Followings_count(),
		"user_followers": user.Followers_count(),
	})
}

func UnfollowUser(w http.ResponseWriter, r *http.Request) {
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

	targetUserIdStr := mux.Vars(r)["target_user_id"]
	targetUserId, err := strconv.Atoi(targetUserIdStr)
	if err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to convert target user ID from string to integer")
		return
	}

	if targetUserId == userId {
		handlers.ErrorHandler(w, http.StatusBadRequest, "You can't unfollow yourself")
		return
	}

	var user models.User
	if err := initializers.DB.First(&user, userId).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User not found")
		return
	}

	var targetUser models.User
	if err := initializers.DB.First(&targetUser, targetUserId).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Target user not found")
		return
	}

	// Fix comparison error
	followingIndex := -1
	for i, following := range user.Following {
		if following == uint(targetUserId) {
			followingIndex = i
			break
		}
	}

	if followingIndex == -1 {
		handlers.ErrorHandler(w, http.StatusBadRequest, "You are not following this user")
		return
	}

	user.Following = append(user.Following[:followingIndex], user.Following[followingIndex+1:]...)
	if err := initializers.DB.Save(&user).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to update following list")
		return
	}

	if targetUser.Followers == nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Inconsistent follow state detected")
		return
	}

	followersIndex := -1
	for i, follower := range targetUser.Followers {
		if follower == user.ID {
			followersIndex = i
			break
		}
	}

	if followersIndex == -1 {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "User is not present in target user follow list")
		return
	}

	targetUser.Followers = append(targetUser.Followers[:followersIndex], targetUser.Followers[followersIndex+1:]...)
	if err := initializers.DB.Save(&targetUser).Error; err != nil {
		handlers.ErrorHandler(w, http.StatusInternalServerError, "Failed to update followers list")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":        "UnFollowed user successfully",
		"user_following": user.Followings_count(),
		"user_followers": user.Followers_count(),
	})
}
