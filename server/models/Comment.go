package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	Content   string `gorm:"type:text"`
	UserId    uint   `gorm:"not null"`
	StartupId uint   `gorm:"not null;index"`
}
