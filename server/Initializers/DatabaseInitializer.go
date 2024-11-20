package initializers

import (
	"fmt"
	"server/models"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func DatabaseInit() error {

	// Supabase DB connection string
	DB_URI := "user=postgres password=postgres host=localhost port=5432 dbname=postgres"

	// Initialize GORM connection to Supabase PostgreSQL
	db, err := gorm.Open(postgres.Open(DB_URI), &gorm.Config{
		PrepareStmt: false,                               // Ensure prepared statements are disabled (optional)
		Logger:      logger.Default.LogMode(logger.Info), // Enable GORM query logging (for debugging)
	})

	if err != nil {
		return fmt.Errorf("error connecting to the database: %w", err)
	}

	// Set up the SQL DB connection pool for performance optimization
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get raw SQL DB connection: %w", err)
	}

	// Configure connection pool settings
	sqlDB.SetMaxIdleConns(5)                   // Max idle connections
	sqlDB.SetMaxOpenConns(50)                  // Max open connections
	sqlDB.SetConnMaxLifetime(30 * time.Minute) // Max connection lifetime

	// Store the initialized DB instance for global use
	DB = db

	// Perform database migrations
	if err := DB.AutoMigrate(
		&models.Category{},
		&models.User{},
		&models.Startup{},
		&models.Comment{},
	); err != nil {
		return fmt.Errorf("error during migration: %w", err)
	}

	// Print a message indicating successful connection
	fmt.Println("Database Connected")

	return nil
}
