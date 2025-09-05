package handlers

import (
	"net/http"
	"time"
	"vercel-clone-go/internal/database"
	"vercel-clone-go/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ProjectHandler handles project routes
type ProjectHandler struct{}

// NewProjectHandler creates a new project handler
func NewProjectHandler() *ProjectHandler {
	return &ProjectHandler{}
}

// GetProjects returns all projects for the authenticated user
func (h *ProjectHandler) GetProjects(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User not authenticated"})
		return
	}

	db := database.GetDB()
	var projects []models.Project

	if err := db.Where("user_id = ?", userID).Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to fetch projects"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// CreateProject creates a new project
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User not authenticated"})
		return
	}

	var req models.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request data"})
		return
	}

	project := models.Project{
		ID:          uuid.New().String(),
		Name:        req.Name,
		Description: req.Description,
		UserID:      userID.(string),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	db := database.GetDB()
	if err := db.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create project"})
		return
	}

	c.JSON(http.StatusCreated, project)
}