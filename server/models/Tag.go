package models

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name        string    `gorm:"not null;type:varchar(50)"`
	Description string    `gorm:"type:text"`
	Startups    []Startup `gorm:"many2many:startup_tags;"`
}
