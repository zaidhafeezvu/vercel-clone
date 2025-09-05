package services

import (
	"archive/zip"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
	"vercel-clone-go/internal/database"
	"vercel-clone-go/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// DeploymentService handles deployment operations
type DeploymentService struct {
	deploymentsDir string
	tempUploadDir  string
}

// NewDeploymentService creates a new deployment service
func NewDeploymentService(deploymentsDir, tempUploadDir string) *DeploymentService {
	return &DeploymentService{
		deploymentsDir: deploymentsDir,
		tempUploadDir:  tempUploadDir,
	}
}

// CreateDeployment creates a new deployment for a project
func (ds *DeploymentService) CreateDeployment(projectID, userID, commitMessage string, zipFilePath string) (*models.Deployment, error) {
	db := database.GetDB()

	// Verify project exists and belongs to user
	var project models.Project
	if err := db.Where("id = ? AND user_id = ?", projectID, userID).First(&project).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("project not found")
		}
		return nil, err
	}

	// Create deployment record
	deployment := &models.Deployment{
		ID:            uuid.New().String(),
		ProjectID:     projectID,
		Status:        "pending",
		CommitMessage: commitMessage,
		CreatedAt:     time.Now(),
	}

	if err := db.Create(deployment).Error; err != nil {
		return nil, err
	}

	// Start deployment process in background
	go ds.processDeployment(deployment, zipFilePath)

	return deployment, nil
}

// processDeployment handles the deployment process
func (ds *DeploymentService) processDeployment(deployment *models.Deployment, zipFilePath string) {
	db := database.GetDB()

	// Update status to building
	db.Model(deployment).Update("status", "building")

	// Create deployment directory
	deploymentDir := filepath.Join(ds.deploymentsDir, deployment.ID)
	if err := os.MkdirAll(deploymentDir, 0755); err != nil {
		ds.updateDeploymentStatus(deployment.ID, "error")
		return
	}

	// Extract ZIP file if provided
	if zipFilePath != "" {
		if err := ds.extractZipFile(zipFilePath, deploymentDir); err != nil {
			ds.updateDeploymentStatus(deployment.ID, "error")
			return
		}
		// Clean up uploaded file
		os.Remove(zipFilePath)
	} else {
		// Create sample app
		if err := ds.createSampleApp(deploymentDir); err != nil {
			ds.updateDeploymentStatus(deployment.ID, "error")
			return
		}
	}

	// Simulate build process (in real implementation, this would run actual build commands)
	time.Sleep(5 * time.Second)

	// Generate deployment URL
	url := fmt.Sprintf("http://localhost:3001/deployments/%s", deployment.ID)
	
	// Update deployment status to success
	db.Model(deployment).Updates(map[string]interface{}{
		"status": "success",
		"url":    url,
	})
}

// updateDeploymentStatus updates the deployment status
func (ds *DeploymentService) updateDeploymentStatus(deploymentID, status string) {
	db := database.GetDB()
	db.Model(&models.Deployment{}).Where("id = ?", deploymentID).Update("status", status)
}

// extractZipFile extracts a zip file to the target directory
func (ds *DeploymentService) extractZipFile(zipFilePath, targetDir string) error {
	reader, err := zip.OpenReader(zipFilePath)
	if err != nil {
		return err
	}
	defer reader.Close()

	for _, file := range reader.File {
		// Skip directories and hidden files
		if file.FileInfo().IsDir() || strings.HasPrefix(filepath.Base(file.Name), ".") {
			continue
		}

		// Create the file path
		filePath := filepath.Join(targetDir, file.Name)
		
		// Ensure the directory exists
		if err := os.MkdirAll(filepath.Dir(filePath), 0755); err != nil {
			return err
		}

		// Extract the file
		rc, err := file.Open()
		if err != nil {
			return err
		}

		outFile, err := os.Create(filePath)
		if err != nil {
			rc.Close()
			return err
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()

		if err != nil {
			return err
		}
	}

	return nil
}

// createSampleApp creates a sample application
func (ds *DeploymentService) createSampleApp(deploymentDir string) error {
	indexHTML := `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Sample App Deployed!</h1>
        <p>This is a sample application deployed by the Vercel Clone.</p>
        <p>Deployment completed successfully.</p>
    </div>
</body>
</html>`

	return os.WriteFile(filepath.Join(deploymentDir, "index.html"), []byte(indexHTML), 0644)
}

// EnsureDirectories ensures required directories exist
func (ds *DeploymentService) EnsureDirectories() error {
	dirs := []string{ds.deploymentsDir, ds.tempUploadDir}
	
	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}
	
	return nil
}