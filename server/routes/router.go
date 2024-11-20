package routes

import (
	"net/http"
	"server/controllers"
	"server/middlewares"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// SetupRouter returns the configured router instead of starting the server
func SetupRouter() http.Handler {
	r := mux.NewRouter()
	s := r.PathPrefix("/api").Subrouter()
	// Api for Auth
	s.HandleFunc("/register", controllers.Register).Methods("POST")
	s.HandleFunc("/login", controllers.Login).Methods("POST")
	s.HandleFunc("/verify", controllers.VerifyToken).Methods("GET")
	s.HandleFunc("/logout", controllers.Logout).Methods("GET")

	s.HandleFunc("/{any:.*}", controllers.OptionController).Methods(http.MethodOptions)

	// Api with login
	s.HandleFunc("/users", controllers.GetUsers).Methods("GET")
	s.HandleFunc("/users/{id}", controllers.GetUser).Methods("GET")

	// Api after login
	auth := s.PathPrefix("/auth").Subrouter()
	auth.Use(middlewares.AuthMiddleware)
	auth.HandleFunc("/update", controllers.UpdateProfile).Methods("PUT")
	auth.HandleFunc("/delete", controllers.DeleteProfile).Methods("DELETE")
	auth.HandleFunc("/follow/{target_user_id}", controllers.FollowUser).Methods("PUT")
	auth.HandleFunc("/unfollow/{target_user_id}", controllers.UnfollowUser).Methods("PUT")

	startup := s.PathPrefix("/startup").Subrouter()
	startup.HandleFunc("/GetAllStartup", controllers.GetAllStartup).Methods("GET")
	startup.HandleFunc("/GetStartup/{id}", controllers.GetStartup).Methods("GET")
	startup.HandleFunc("/GetStartupUser/{userId}", controllers.GetStartupsByUserId).Methods("GET")

	startupAuth := startup.PathPrefix("/auth").Subrouter()
	startupAuth.Use(middlewares.AuthMiddleware)
	startupAuth.HandleFunc("/createStartup", controllers.CreateStartup).Methods("POST")
	startupAuth.HandleFunc("/updateStartup/{id}", controllers.UpdateStartup).Methods("PUT")
	startupAuth.HandleFunc("/deleteStartup/{id}", controllers.DeleteStartup).Methods("DELETE")
	startupAuth.HandleFunc("/likeStartup/{startupId}", controllers.LikeStartup).Methods("PUT")
	startupAuth.HandleFunc("/dislikeStartup/{startupId}", controllers.DislikeStartup).Methods("PUT")
	startupAuth.HandleFunc("/viewStartup/{startupId}", controllers.AddViewStartup).Methods("GET")

	category := s.PathPrefix("/category").Subrouter()
	category.Use(middlewares.AuthMiddleware)
	category.HandleFunc("/GetAllCategory", controllers.GetAllCategory).Methods("GET")
	category.HandleFunc("/GetCategory/{id}", controllers.GetCategory).Methods("GET")
	category.HandleFunc("/createCategory", controllers.CreateCategory).Methods("POST")

	comment := s.PathPrefix("/comment").Subrouter()
	comment.HandleFunc("/GetAllComent/{startupId}", controllers.GetAllComments).Methods("GET")
	categoryAuth := comment.PathPrefix("/auth").Subrouter()
	categoryAuth.Use(middlewares.AuthMiddleware)
	categoryAuth.HandleFunc("/createComment/{startupId}", controllers.PostComment).Methods("POST")
	categoryAuth.HandleFunc("/deleteComment/{commentId}", controllers.DeleteComment).Methods("DELETE")

	corsOpts := handlers.CORS(
		handlers.AllowedOrigins([]string{
			"http://localhost:3000",
			"http://127.0.0.1:3000",
		}),
		handlers.AllowedMethods([]string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		}),
		handlers.AllowedHeaders([]string{
			"X-Requested-With",
			"Content-Type",
			"Authorization",
			"Accept",
			"Origin",
		}),
		handlers.AllowCredentials(),
	)

	// Return the router with CORS middleware applied
	return corsOpts(r)
}
