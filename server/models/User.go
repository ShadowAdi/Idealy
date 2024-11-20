package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

type SocialLinksStruct struct {
	Platform string `json:"platform"`
	Url      string `json:"url"`
}

// Define a type for the array of SocialLinksStruct
type SocialLinks []SocialLinksStruct

// Implement the driver.Valuer interface for SocialLinks (for saving to the database)
func (s SocialLinks) Value() (driver.Value, error) {
	return json.Marshal(s)
}

// Implement the sql.Scanner interface for SocialLinks (for reading from the database)
func (s *SocialLinks) Scan(value interface{}) error {
	// Convert the value from the database (which is of type []uint8) to JSON
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	// Unmarshal the JSON bytes into the SocialLinks slice
	return json.Unmarshal(bytes, s)
}

type User struct {
	gorm.Model
	Username    string       `json:"username,omitempty"`
	Email       string       `gorm:"unique;not null"`
	Password    string       `gorm:"not null"`
	Profile     *string      `gorm:"type:varchar(255)"`
	Bio         *string      `json:"bio,omitempty"`
	SocialLinks SocialLinks  `gorm:"type:json"`
	Followers   IntegerArray `gorm:"type:json"` // Array of follower IDs
	Following   IntegerArray `gorm:"type:json"` // Array of following IDs
	Location    string       `gorm:"type:varchar(100)"`
	Ideas       []Startup    `gorm:"foreignKey:UserId"`
}

func (user *User) ToResponse() map[string]interface{} {
	// Return the user data excluding the password
	return map[string]interface{}{
		"id":           user.ID,
		"username":     user.Username,
		"email":        user.Email,
		"profile":      user.Profile,
		"bio":          user.Bio,
		"social_links": user.SocialLinks,
		"followers":    []uint(user.Followers),
		"following":    []uint(user.Following),
		"location":     user.Location,
	}
}

func (user *User) Followers_count() int {
	if user.Followers == nil {
		return 0
	}
	return len(user.Followers)
}

func (user *User) Followings_count() int {
	if user.Following == nil {
		return 0
	}
	return len(user.Following)
}

func (user *User) Startup_count() int {
	return len(user.Ideas)
}

type IntegerArray []uint

func (a *IntegerArray) Scan(value interface{}) error {
	if value == nil {
		*a = IntegerArray{}
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}

	var arr []uint
	err := json.Unmarshal(bytes, &arr)
	if err != nil {
		return err
	}

	*a = IntegerArray(arr)
	return nil
}

// Value implements the driver.Valuer interface
func (a IntegerArray) Value() (driver.Value, error) {
	if a == nil {
		return nil, nil
	}
	return json.Marshal(a)
}
