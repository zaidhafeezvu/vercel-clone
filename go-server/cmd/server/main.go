package main

import (
	"log"
	"os"
	"path/filepath"
	"vercel-clone-go/internal/database"
	"vercel-clone-go/internal/handlers"
	"vercel-clone-go/internal/middleware"
	"vercel-clone-go/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	dbPath := "../../data.db"
	if err := database.Initialize(dbPath); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Create deployment service
	deploymentsDir := "../../deployments"
	tempUploadDir := "../../temp-uploads"
	deploymentService := services.NewDeploymentService(deploymentsDir, tempUploadDir)

	// Ensure directories exist
	if err := deploymentService.EnsureDirectories(); err != nil {
		log.Fatal("Failed to create directories:", err)
	}

	// Create handlers
	authHandler := handlers.NewAuthHandler()
	projectHandler := handlers.NewProjectHandler()
	deploymentHandler := handlers.NewDeploymentHandler(deploymentService)

	// Setup Gin router
	r := gin.Default()

	// Setup CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://localhost:3000"}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Cookie"}
	r.Use(cors.New(config))

	// Serve static files for deployments
	r.Static("/deployments", deploymentsDir)

	// Public directory for dashboard
	publicDir := "../../public"
	if _, err := os.Stat(publicDir); err == nil {
		r.Static("/", publicDir)
	}

	// API routes
	api := r.Group("/api")

	// Auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/signup", authHandler.SignUp)
		auth.POST("/signin", authHandler.SignIn)
		auth.POST("/signout", authHandler.SignOut)
		auth.GET("/session", middleware.AuthMiddleware(), authHandler.GetSession)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Project routes
		protected.GET("/projects", projectHandler.GetProjects)
		protected.POST("/projects", projectHandler.CreateProject)

		// Deployment routes
		protected.GET("/projects/:projectId/deployments", deploymentHandler.GetDeployments)
		protected.POST("/projects/:projectId/deploy", deploymentHandler.CreateDeployment)

		// Package manager info
		protected.GET("/package-managers", deploymentHandler.GetPackageManagers)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("Go server starting on port %s", port)
	log.Printf("Deployments directory: %s", filepath.Join(deploymentsDir))
	log.Printf("Temp upload directory: %s", filepath.Join(tempUploadDir))
	
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}