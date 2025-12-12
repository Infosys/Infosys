// Package database provides database connection utilities for the Property Tax Onboarding Service.
// It initializes and returns a GORM database instance configured for PostgreSQL.
package database

import (
	"fmt"
	"property-tax-onboarding/internal/config"
	"property-tax-onboarding/pkg/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// Connect establishes a connection to the PostgreSQL database using GORM.
// It builds the DSN from the provided config, sets the schema, and returns a *gorm.DB instance.
// Logs fatal and exits if the connection fails.
func Connect(cfg *config.Config) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable client_encoding=UTF8 search_path=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSchema,
	)

	// When initializing GORM, you can specify the schema
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix: "DIGIT3.", // Prefix all table names with the schema
		},
	})
	if err != nil {
		logger.Fatal("Failed to connect to database:", err)
	}

	logger.Info("Database connected and migrated successfully")
	return db
}
