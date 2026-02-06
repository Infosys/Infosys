// Entry point for the Property Tax Enumeration Service
package main

import (
	workflow "enumeration/internal/clients"
	"enumeration/internal/config"
	"enumeration/internal/database"
	"enumeration/internal/handlers"
	"enumeration/internal/middleware"
	"enumeration/internal/repositories"
	"enumeration/internal/routes"
	"enumeration/internal/services"
	"enumeration/pkg/logger"

	"github.com/redis/go-redis/v9"

	// Standard and third-party packages
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// init loads environment variables and initializes middleware
func init() {
	err := godotenv.Load()
	if err != nil {
		logger.Error("\nError loading .env file using default environment variables\n")
	}
	middleware.Init()
}

// main sets up dependencies and starts the HTTP server
func main() {
	cfg := config.GetConfig() // Load configuration

	logger.Info("Starting Property Tax Enumeration Service...")
	redisClient := redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddr, // Update with your Redis address
		Password: "",            // Update if you have password
		DB:       0,             // Default DB
	})
	ctx := context.Background()
	if err := redisClient.Ping(ctx).Err(); err != nil {
		logger.Errorf("Redis connection failed: %v (continuing without cache)", err)
		redisClient = nil // Disable Redis if connection fails

	} else {
		logger.Info("Redis connected successfully")
	}

	// Initialize workflow client for external workflow integration
	workflowClient := workflow.NewClient(cfg.WorkflowURL)

	// Connect to the database
	db := database.GetDB()

	// Initialize repositories for data access
	coordinatesRepo := repositories.NewCoordinatesRepository(db)
	floorDetailsRepo := repositories.NewFloorDetailsRepository(db)
	applicationRepo := repositories.NewApplicationRepository(db)
	applicationLogRepo := repositories.NewApplicationLogRepository(db)
	propertyOwnerRepo := repositories.NewPropertyOwnerRepository(db)
	constructionDetailsRepo := repositories.NewConstructionDetailsRepository(db)
	additionalPropertyDetailsRepo := repositories.NewAdditionalPropertyDetailsRepository(db)
	assessmentDetailsRepo := repositories.NewAssessmentDetailsRepository(db)
	propertyRepo := repositories.NewPropertyRepository(db)
	propertyAddressRepo := repositories.NewPropertyAddressRepository(db)
	gisRepo := repositories.NewGISRepository(db)
	amenityRepo := repositories.NewAmenityRepository(db)
	documentRepo := repositories.NewDocumentRepository(db)
	igrsRepo := repositories.NewIGRSRepository(db)

	// Initialize services for business logic
	coordinatesService := services.NewCoordinatesService(coordinatesRepo)
	floorDetailsService := services.NewFloorDetailsService(floorDetailsRepo)
	applicationLogService := services.NewApplicationLogService(applicationLogRepo)
	applicationService := services.NewApplicationService(applicationRepo, propertyOwnerRepo, workflowClient, cfg, applicationLogService)

	propertyOwnerService := services.NewPropertyOwnerService(propertyOwnerRepo)
	constructionDetailsService := services.NewConstructionDetailsService(constructionDetailsRepo)
	additionalPropertyDetailsService := services.NewAdditionalPropertyDetailsService(additionalPropertyDetailsRepo)
	assessmentDetailsService := services.NewAssessmentDetailsService(assessmentDetailsRepo)
	propertyService := services.NewPropertyService(propertyRepo)
	propertyAddressService := services.NewPropertyAddressService(propertyAddressRepo)
	gisService := services.NewGISService(gisRepo)
	amenityService := services.NewAmenityService(amenityRepo)
	documentService := services.NewDocumentService(documentRepo)
	igrsService := services.NewIGRSService(igrsRepo)

	// Initialize handlers
	coordinatesHandler := handlers.NewCoordinatesHandler(coordinatesService)
	floorDetailsHandler := handlers.NewFloorDetailsHandler(floorDetailsService, applicationLogService)
	applicationHandler := handlers.NewApplicationHandler(applicationService)
	applicationLogHandler := handlers.NewApplicationLogHandler(applicationLogService)
	propertyOwnerHandler := handlers.NewPropertyOwnerHandler(propertyOwnerService, applicationLogService)
	constructionDetailsHandler := handlers.NewConstructionDetailsHandler(constructionDetailsService, applicationLogService)
	additionalPropertyDetailsHandler := handlers.NewAdditionalPropertyDetailsHandler(additionalPropertyDetailsService, applicationLogService)
	assessmentDetailsHandler := handlers.NewAssessmentDetailsHandler(assessmentDetailsService, applicationLogService)
	propertyHandler := handlers.NewPropertyHandler(propertyService, applicationLogService)
	propertyAddressHandler := handlers.NewPropertyAddressHandler(propertyAddressService, applicationLogService)
	gisHandler := handlers.NewGISHandler(gisService)
	amenityHandler := handlers.NewAmenityHandler(amenityService, applicationLogService)
	documentHandler := handlers.NewDocumentHandler(documentService)
	igrsHandler := handlers.NewIGRSHandler(igrsService, applicationLogService)
	geojsonHandler := handlers.NewGeoJSONHandler(cfg, redisClient)

	// Setup Gin router for HTTP requests
	router := gin.Default()

	// Add CORS and logging middleware
	router.Use(middleware.CorsMiddleware(), middleware.LoggerMiddleware())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "UP",
			"service": "property-tax-enumeration",
		})
	})

	// Setup routes with handlers configuration
	handlersConfig := &routes.HandlersConfig{
		Coordinates:               coordinatesHandler,
		FloorDetails:              floorDetailsHandler,
		ConstructionDetails:       constructionDetailsHandler,
		AdditionalPropertyDetails: additionalPropertyDetailsHandler,
		AssessmentDetails:         assessmentDetailsHandler,
		Property:                  propertyHandler,
		PropertyAddress:           propertyAddressHandler,
		GIS:                       gisHandler,
		Application:               applicationHandler,
		PropertyOwner:             propertyOwnerHandler,
		Amenity:                   amenityHandler,
		Document:                  documentHandler,
		IGRS:                      igrsHandler,
		ApplicationLog:            applicationLogHandler,
		GeoJSON:                   geojsonHandler,
	}
	routes.SetupRoutes(router, handlersConfig)

	// Start the HTTP server
	address := fmt.Sprintf(":%s", cfg.Port)
	logger.Info("Server starting on", address)
	if err := router.Run(address); err != nil {
		logger.Fatal("Failed to start server:", err)
	}
}
