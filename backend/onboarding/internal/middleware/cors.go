// Package middleware provides custom Gin middleware for the Property Tax Onboarding Service.
// This file implements a configurable CORS middleware for cross-origin HTTP requests.
package middleware

import (
	"strconv"
	"github.com/gin-gonic/gin"
)

// CORSConfig holds configuration options for CORS (Cross-Origin Resource Sharing).
// Allows fine-grained control over allowed origins, methods, headers, credentials, and cache duration.
type CORSConfig struct {
	AllowedOrigins   []string
	AllowedMethods   []string
	AllowedHeaders   []string
	AllowCredentials bool
	MaxAge           int
}

// CORSWithConfig returns a Gin middleware handler that applies CORS headers based on the provided config.
// Supports dynamic origin, method, and header whitelisting, credentials, and preflight request handling.
func CORSWithConfig(config CORSConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Check if the request's Origin is allowed by the config
		allowed := false
		for _, allowedOrigin := range config.AllowedOrigins {
			if allowedOrigin == "*" || allowedOrigin == origin {
				allowed = true
				break
			}
		}

		if allowed {
			// Allow all origins or echo back the request origin
			if len(config.AllowedOrigins) == 1 && config.AllowedOrigins[0] == "*" {
				c.Header("Access-Control-Allow-Origin", "*")
			} else {
				c.Header("Access-Control-Allow-Origin", origin)
			}
		}

		// Set allowed HTTP methods for CORS
		methods := "GET, POST, PUT, DELETE, PATCH, OPTIONS"
		if len(config.AllowedMethods) > 0 {
			methods = ""
			for i, method := range config.AllowedMethods {
				if i > 0 {
					methods += ", "
				}
				methods += method
			}
		}
		c.Header("Access-Control-Allow-Methods", methods)

		// Set allowed HTTP headers for CORS
		headers := "Origin, Content-Type, Accept, Authorization, X-Requested-With, X-Tenant-ID, X-User-ID"
		if len(config.AllowedHeaders) > 0 {
			headers = ""
			for i, header := range config.AllowedHeaders {
				if i > 0 {
					headers += ", "
				}
				headers += header
			}
		}
		c.Header("Access-Control-Allow-Headers", headers)

		// Set whether credentials (cookies, auth) are allowed
		if config.AllowCredentials {
			c.Header("Access-Control-Allow-Credentials", "true")
		}

		// Set how long the results of a preflight request can be cached
		maxAge := 86400 // 24 hours default
		if config.MaxAge > 0 {
			maxAge = config.MaxAge
		}
		c.Header("Access-Control-Max-Age", strconv.Itoa(maxAge))

		// Handle preflight OPTIONS request by returning 204 No Content
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		// Continue to next middleware/handler
		c.Next()
	}
}