package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

type StringArray []string

func (a StringArray) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *StringArray) Scan(value interface{}) error {
	if value == nil {
		*a = StringArray{}
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("invalid type for StringArray")
	}

	return json.Unmarshal(bytes, a)
}

type Startup struct {
	gorm.Model
	UserId         uint        `gorm:"not null" json:"user_id"`
	User           User        `gorm:"foreignKey:UserId" json:"-"`
	Name           string      `gorm:"not null;type:varchar(100)" json:"name"`
	Pitch          string      `gorm:"type:text" json:"pitch"`
	CategoryID     uint        `gorm:"not null" json:"category_id"`
	Category       Category    `gorm:"foreignKey:CategoryID" json:"category"`
	ImageURL       string      `json:"image_url"`
	IsActive       bool        `gorm:"default:false" json:"is_active"`
	SocialLinks    JSON        `gorm:"type:json"`
	Views          int         `gorm:"default:0" json:"views"`
	Likes          StringArray `gorm:"type:jsonb;default:'[]'" json:"likes"`
	Dislikes       StringArray `gorm:"type:jsonb;default:'[]'" json:"dislikes"`
	FundingStage   string      `gorm:"type:varchar(100)" json:"funding_stage"`
	TargetAudience string      `gorm:"type:varchar(100)" json:"target_audience"`
	Comments       []Comment   `gorm:"foreignKey:StartupId" json:"comments"`
}

func (s *Startup) BeforeCreate(tx *gorm.DB) error {
	if s.SocialLinks == nil {
		s.SocialLinks = JSON{} // Assuming JSON is a map[string]string or similar.
	}
	if s.Likes == nil {
		s.Likes = StringArray{}
	}
	if s.Dislikes == nil {
		s.Dislikes = StringArray{}
	}
	// Handle empty ImageURL
	if s.ImageURL == "" {
		s.ImageURL = "{}" // Or any default JSON value
	}
	return nil
}
