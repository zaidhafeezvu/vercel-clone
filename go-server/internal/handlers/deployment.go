package handlers

import (
	"net/http"
	"path/filepath"
	"vercel-clone-go/internal/database"
	"vercel-clone-go/internal/models"
	"vercel-clone-go/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// DeploymentHandler handles deployment routes
type DeploymentHandler struct {
	deploymentService *services.DeploymentService
}

// NewDeploymentHandler creates a new deployment handler
func NewDeploymentHandler(deploymentService *services.DeploymentService) *DeploymentHandler {
	return &DeploymentHandler{
		deploymentService: deploymentService,
	}
}

// GetDeployments returns all deployments for a project
func (h *DeploymentHandler) GetDeployments(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User not authenticated"})
		return
	}

	projectID := c.Param("projectId")
	if projectID == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Project ID is required"})
		return
	}

	db := database.GetDB()

	// Verify project belongs to user
	var project models.Project
	if err := db.Where("id = ? AND user_id = ?", projectID, userID).First(&project).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Project not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Database error"})
		return
	}

	var deployments []models.Deployment
	if err := db.Where("project_id = ?", projectID).Order("created_at DESC").Find(&deployments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to fetch deployments"})
		return
	}

	c.JSON(http.StatusOK, deployments)
}

// CreateDeployment creates a new deployment
func (h *DeploymentHandler) CreateDeployment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User not authenticated"})
		return
	}

	projectID := c.Param("projectId")
	if projectID == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Project ID is required"})
		return
	}

	// Parse form data
	var req models.CreateDeploymentRequest
	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid request data"})
			return
		}
	} else {
		req.CommitMessage = c.PostForm("commit_message")
	}

	// Handle file upload if present
	var zipFilePath string
	if file, err := c.FormFile("projectFile"); err == nil {
		// Save uploaded file
		tempPath := filepath.Join("temp-uploads", file.Filename)
		if err := c.SaveUploadedFile(file, tempPath); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to save uploaded file"})
			return
		}
		zipFilePath = tempPath
	}

	// Create deployment
	deployment, err := h.deploymentService.CreateDeployment(projectID, userID.(string), req.CommitMessage, zipFilePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, deployment)
}

// GetPackageManagers returns available package managers
func (h *DeploymentHandler) GetPackageManagers(c *gin.Context) {
	// Simplified response for now
	managers := map[string]bool{
		"npm":  true,
		"yarn": false,
		"pnpm": false,
		"bun":  false,
	}

	response := gin.H{
		"available":     managers,
		"recommended":   "npm",
		"defaultChoice": "npm",
	}

	c.JSON(http.StatusOK, response)
}