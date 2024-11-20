package models

import "gorm.io/gorm"

// Collaborator model for tracking collaborators on a startup
type Collaborator struct {
	gorm.Model
	UserID    uint    `gorm:"not null"`             // ID of the user who is a collaborator
	StartupID uint    `gorm:"not null"`             // ID of the startup they are collaborating on
	User      User    `gorm:"foreignKey:UserID"`    // Link to User model
	Startup   Startup `gorm:"foreignKey:StartupID"` // Link to Startup model
	Role      string  `gorm:"type:varchar(50)"`     // Role of the collaborator, e.g., "Developer", "Designer"
	IsActive  bool    `gorm:"default:true"`         // Status of collaboration
}
