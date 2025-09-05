package database

import (
	"log"
	"vercel-clone-go/internal/models"
	
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Initialize initializes the database connection and runs migrations
func Initialize(dbPath string) error {
	var err error
	
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return err
	}
	
	// Auto migrate schemas
	err = DB.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Deployment{},
	)
	if err != nil {
		return err
	}
	
	log.Println("Database initialized successfully")
	return nil
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}