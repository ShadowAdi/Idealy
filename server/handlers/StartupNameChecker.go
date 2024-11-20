package handlers

import (
	"errors"
	initializers "server/Initializers"
	"server/models"

	"gorm.io/gorm"
)

func StartupNameCheck(name string) error {
	var existingStartup models.Startup
	result := initializers.DB.Where("name = ?", name).First(&existingStartup)
	if result.Error == nil {
		return errors.New("startup name already taken")
	} else if result.Error != gorm.ErrRecordNotFound {
		return errors.New("database error occurred")
	}
	return nil
}
