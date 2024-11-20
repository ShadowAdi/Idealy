package handlers

import (
	"server/models"
	"time"
)

type UpdateUser struct {
	Username    string      `json:"username,omitempty"`
	Bio         string      `json:"bio,omitempty"`
	Profile     string      `json:"profile,omitempty"`
	SocialLinks models.JSON `json:"social_links,omitempty"`
	Location    string      `json:"location,omitempty"`
}

type StartupResponse struct {
	ID             uint              `json:"id"`
	CreatedAt      time.Time         `json:"created_at"`
	UpdatedAt      time.Time         `json:"updated_at"`
	UserID         uint              `json:"user_id"`
	Name           string            `json:"name"`
	Pitch          string            `json:"pitch"`
	CategoryID     uint              `json:"category_id"`
	ImageURL       string            `json:"image_url"`
	IsActive       bool              `json:"is_active"`
	SocialLinks    map[string]string `json:"social_links"`
	Views          int               `json:"views"`
	Likes          []string          `json:"likes"`
	Dislikes       []string          `json:"dislikes"`
	FundingStage   string            `json:"funding_stage"`
	TargetAudience string            `json:"target_audience"`
}

type SocialLink struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
}

type StartupUpdatedData struct {
	Name           string       `json:"name"`
	Pitch          string       `json:"pitch"`
	CategoryID     uint         `json:"category_id"`
	ImageURL       string       `json:"image_url"`
	IsActive       bool         `json:"is_active"`
	SocialLinks    []SocialLink `json:"social_links"`
	FundingStage   string       `json:"funding_stage"`
	TargetAudience string       `json:"target_audience"`
	ID             uint         `json:"id"`
}

type CommentStructData struct {
	Content string `json:"string"`
}
