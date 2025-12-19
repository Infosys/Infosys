// Entry point for the Property Tax Onboarding Service.
// This file bootstraps the application, sets up dependencies, middleware, routes, and starts the HTTP server.
package main

import (
	"log"
	"property-tax-onboarding/internal/config"
	"property-tax-onboarding/internal/database"
	"property-tax-onboarding/internal/handlers"
	"property-tax-onboarding/internal/middleware"
	"property-tax-onboarding/internal/repositories"
	"property-tax-onboarding/internal/routes"
	"property-tax-onboarding/internal/scheduler"
	"property-tax-onboarding/internal/services"
	"property-tax-onboarding/internal/validator"
	"property-tax-onboarding/pkg/logger"
	"strings"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize the structured logger (Logrus)
	logger.InitLogger()

	// Load application configuration from environment variables or .env file
	cfg := config.GetConfig()

	// Connect to PostgreSQL database using GORM
	db := database.Connect(cfg)
	sqlDB, err := db.DB()
	if err != nil {
		logger.Fatal("Failed to get database instance", "error", err)
	}
	// Ensure database connection is closed on shutdown
	defer sqlDB.Close()

	// Set Gin web framework mode (debug/release)
	gin.SetMode(cfg.GinMode)

	// Initialize the user repository (data access layer)
	userRepo := repositories.NewPostgreSQLUserRepository(db)

	// Initialize Keycloak service for identity management
	keycloakService := services.NewKeycloakService(
		cfg.KeycloakBaseURL,
		cfg.TokenURL,
		cfg.UserURL,
		cfg.AssignRoleURL,
		cfg.RoleURL,
		cfg.RolesURL,
		cfg.DeleteURL,
		cfg.KeycloakAdminUsername,
		cfg.KeycloakAdminPassword,
		cfg.KeycloakClientID,
		cfg.KeycloakClientSecret,
		cfg.KeycloakRealm,
		userRepo,
	)

	// Initialize user validation service (input validation)
	validationService := validator.NewUserValidationService(userRepo, db)

	zoneMappingRepo := repositories.NewPostgreSQLZoneMappingRepository(db)

	// Initialize user service (business logic layer)
	userService := services.NewUserService(keycloakService, userRepo, validationService, zoneMappingRepo)

	// Initialize HTTP handlers (request/response layer)
	userHandler := handlers.NewUserHandler(userService)

	// Create a new Gin router instance
	router := gin.New()

	// Configure and add CORS middleware
	allowedOrigins := strings.Split(cfg.CORSAllowedOrigins, ",")
	allowedMethods := strings.Split(cfg.CORSAllowedMethods, ",")
	allowedHeaders := strings.Split(cfg.CORSAllowedHeaders, ",")

	corsConfig := middleware.CORSConfig{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   allowedMethods,
		AllowedHeaders:   allowedHeaders,
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	}
	router.Use(middleware.CORSWithConfig(corsConfig))

	// Add logging and recovery middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// Register all API routes (endpoints)
	routes.SetupRoutes(router, userHandler)

	// Start the scheduler for user activation/deactivation
	scheduler.ScheduleUserActivation(keycloakService, userRepo)

	// Start server
	serverAddr := cfg.ServerHost + ":" + cfg.ServerPort
	log.Printf("Starting property tax onboarding service on %s", serverAddr)

	if err := router.Run(serverAddr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
