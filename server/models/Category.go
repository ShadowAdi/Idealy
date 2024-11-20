package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name        string `gorm:"not null;type:varchar(50)"`
	Description string `gorm:"type:text"`
}
