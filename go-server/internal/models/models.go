package models

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Name      string    `json:"name" gorm:"not null"`
	Password  string    `json:"-" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Project represents a project in the system
type Project struct {
	ID          string       `json:"id" gorm:"primaryKey"`
	Name        string       `json:"name" gorm:"not null"`
	Description string       `json:"description"`
	UserID      string       `json:"user_id" gorm:"not null"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
	Deployments []Deployment `json:"deployments,omitempty" gorm:"foreignKey:ProjectID"`
}

// Deployment represents a deployment of a project
type Deployment struct {
	ID            string    `json:"id" gorm:"primaryKey"`
	ProjectID     string    `json:"project_id" gorm:"not null"`
	Status        string    `json:"status" gorm:"not null"` // pending, building, success, error
	URL           string    `json:"url"`
	CommitMessage string    `json:"commit_message"`
	CreatedAt     time.Time `json:"created_at"`
}

// CreateProjectRequest represents request data for creating a project
type CreateProjectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

// CreateDeploymentRequest represents request data for creating a deployment
type CreateDeploymentRequest struct {
	CommitMessage string `json:"commit_message"`
}

// AuthRequest represents authentication request data
type AuthRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name,omitempty"`
}

// AuthResponse represents authentication response data
type AuthResponse struct {
	User UserResponse `json:"user"`
}

// UserResponse represents user data in responses
type UserResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// ErrorResponse represents error response data
type ErrorResponse struct {
	Error string `json:"error"`
}

// MessageResponse represents success message response
type MessageResponse struct {
	Message string `json:"message"`
}