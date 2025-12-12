// Package response provides standardized API response helpers for the onboarding service.
// This file defines the APIResponse struct and utility functions for success and error responses.
package response

import (
	"github.com/gin-gonic/gin"
)

// APIResponse represents a standard API response structure for all endpoints.
// Includes success flag, message, data payload, and error details.
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Errors  []string    `json:"errors,omitempty"`
}

// Success sends a successful JSON response with the given status code, message, and data.
// Used by handlers to return standardized success responses.
func Success(c *gin.Context, statusCode int, message string, data interface{}) {
	response := APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
	c.JSON(statusCode, response)
}

// Error sends a standardized error JSON response with the given status code, message, and error detail.
// Used by handlers to return error responses in a consistent format.
func Error(c *gin.Context, statusCode int, message string, errorDetail string) {
	response := APIResponse{
		Success: false,
		Message: message,
		Errors:  []string{errorDetail},
	}
	c.JSON(statusCode, response)
}
