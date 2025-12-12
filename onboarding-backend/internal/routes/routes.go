// Package routes defines HTTP route configuration for the onboarding service.
// This file sets up all API endpoints and maps them to handler functions.
package routes

import (
	"property-tax-onboarding/internal/handlers"
	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all application routes for the onboarding service.
// It registers health check and user management endpoints, and groups API v1 routes.
//
// Parameters:
//   - router: Gin engine instance to register routes on
//   - userHandler: Handler for user-related endpoints
func SetupRoutes(router *gin.Engine, userHandler *handlers.UserHandler) {
	// Health check endpoint to verify service status
	router.GET("/health", userHandler.HealthCheck)

	// API v1 routes group all versioned endpoints under /api/v1
	v1 := router.Group("/api/v1")
	{
		// Unified user routes (supports both agents and citizens via role in payload)
		// Provides endpoints for user CRUD operations and role-based queries
		users := v1.Group("/users")
		{
			users.GET("", userHandler.GetAllUsers)                  // Get all users with optional filters (role, status, etc.)
			users.POST("", userHandler.CreateUser)                  // Create a new user (agent or citizen)
			users.GET("/count", userHandler.GetUserCounts) 
			users.GET("/:id", userHandler.GetUser)                  // Retrieve user details by user ID
			users.PUT("/:id", userHandler.UpdateUser)               // Update all user information by user ID
			users.GET("/by-role/:role", userHandler.GetUsersByRole) // Retrieve users by specific role
			users.DELETE("/:id", userHandler.DeleteUser)            // Delete user by user ID
		}
	}
}
