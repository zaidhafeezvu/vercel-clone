package handlers

import (
	"net/http"
	"vercel-clone-go/internal/auth"
	"vercel-clone-go/internal/database"
	"vercel-clone-go/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AuthHandler handles authentication routes
type AuthHandler struct{}

// NewAuthHandler creates a new auth handler
func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

// SignUp handles user registration
func (h *AuthHandler) SignUp(c *gin.Context) {
	var req models.AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request data"})
		return
	}

	db := database.GetDB()

	// Check if user already exists
	var existingUser models.User
	if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "User already exists"})
		return
	}

	// Hash password
	hashedPassword, err := auth.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to hash password"})
		return
	}

	// Create user
	user := models.User{
		ID:       uuid.New().String(),
		Email:    req.Email,
		Name:     req.Name,
		Password: hashedPassword,
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create user"})
		return
	}

	// Generate token
	token, err := auth.GenerateToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate token"})
		return
	}

	// Set cookie
	c.SetCookie("auth-token", token, 7*24*60*60, "/", "", false, true) // 7 days

	c.JSON(http.StatusOK, models.AuthResponse{
		User: models.UserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
		},
	})
}

// SignIn handles user authentication
func (h *AuthHandler) SignIn(c *gin.Context) {
	var req models.AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request data"})
		return
	}

	db := database.GetDB()

	// Find user
	var user models.User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Database error"})
		return
	}

	// Check password
	if err := auth.CheckPassword(req.Password, user.Password); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid credentials"})
		return
	}

	// Generate token
	token, err := auth.GenerateToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate token"})
		return
	}

	// Set cookie
	c.SetCookie("auth-token", token, 7*24*60*60, "/", "", false, true) // 7 days

	c.JSON(http.StatusOK, models.AuthResponse{
		User: models.UserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
		},
	})
}

// SignOut handles user logout
func (h *AuthHandler) SignOut(c *gin.Context) {
	c.SetCookie("auth-token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, models.MessageResponse{Message: "Signed out successfully"})
}

// GetSession returns current user session
func (h *AuthHandler) GetSession(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "No session found"})
		return
	}

	userEmail, _ := c.Get("user_email")
	userName, _ := c.Get("user_name")

	c.JSON(http.StatusOK, gin.H{
		"user": models.UserResponse{
			ID:    userID.(string),
			Email: userEmail.(string),
			Name:  userName.(string),
		},
	})
}