// Package config provides application configuration management.
// It loads environment variables, supports .env files, and exposes a singleton Config struct.
package config

import (
	"log"
	"os"
	"sync"
	"github.com/joho/godotenv"

)

// instance holds the singleton Config instance.
// once ensures the config is loaded only once (thread-safe).
var (
	instance *Config
	once     sync.Once
)

// Config holds all configuration values for the application.
// It is populated from environment variables or a .env file at startup.
type Config struct {
	// Server config
	ServerPort string
	ServerHost string
	GinMode    string

	// Keycloak config
	KeycloakBaseURL       string
	KeycloakAdminUsername string
	KeycloakAdminPassword string
	KeycloakClientID      string
	KeycloakClientSecret  string
	KeycloakRealm         string
	TokenURL              string
	UserURL               string
	AssignRoleURL         string
	RoleURL               string
	RolesURL              string
	DeleteURL             string

	// Database config
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSchema   string
	
	// CORS config
	CORSAllowedOrigins string
	CORSAllowedMethods string
	CORSAllowedHeaders string

	//MDMS config
	MDMS_API_URL string
}

// GetConfig returns the singleton instance of Config.
// Loads .env file if present, then populates Config from environment variables.
// Validates critical configuration values before returning.
func GetConfig() *Config {
	once.Do(func() {
		// Load .env file from the specified path

		err := godotenv.Load()
		if err != nil {
			log.Println("Warning: .env file not found at", "using system environment variables")
		}

		// Initialize the Config instance with environment variables or defaults
		instance = &Config{
			// Server config
			ServerPort: getEnvOrDefault("SERVER_PORT", "8089"),
			ServerHost: getEnvOrDefault("SERVER_HOST", "0.0.0.0"),
			GinMode:    getEnvOrDefault("GIN_MODE", "debug"),

			// Keycloak config
			KeycloakBaseURL:       getEnvOrDefault("KEYCLOAK_BASE_URL", ""),
			KeycloakAdminUsername: getEnvOrDefault("KEYCLOAK_ADMIN_USER", ""),
			KeycloakAdminPassword: getEnvOrDefault("KEYCLOAK_ADMIN_PASS", ""),
			KeycloakClientID:      getEnvOrDefault("KEYCLOAK_CLIENT_ID", ""),
			KeycloakClientSecret:  getEnvOrDefault("KEYCLOAK_CLIENT_SECRET", ""),
			KeycloakRealm:         getEnvOrDefault("KEYCLOAK_REALM", ""),
			TokenURL:              getEnvOrDefault("TOKEN_URL", ""),
			UserURL:               getEnvOrDefault("USER_URL", ""),
			AssignRoleURL:         getEnvOrDefault("ASSIGN_ROLE_URL", ""),
			RoleURL:               getEnvOrDefault("ROLE_URL", ""),
			RolesURL:              getEnvOrDefault("ROLES_URL", ""),
			DeleteURL:             getEnvOrDefault("DELETE_URL", ""),

			// Database config
			DBHost:     getEnvOrDefault("DB_HOST", ""),
			DBPort:     getEnvOrDefault("DB_PORT", ""),
			DBUser:     getEnvOrDefault("DB_USER", ""),
			DBPassword: getEnvOrDefault("DB_PASSWORD", ""),
			DBName:     getEnvOrDefault("DB_NAME", ""),
			DBSchema:   getEnvOrDefault("DB_SCHEMA", "DIGIT3"),

			// CORS config
			CORSAllowedOrigins: getEnvOrDefault("CORS_ALLOWED_ORIGINS", "*"),
			CORSAllowedMethods: getEnvOrDefault("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,PATCH,OPTIONS"),
			CORSAllowedHeaders: getEnvOrDefault("CORS_ALLOWED_HEADERS", "Origin,Content-Type,Accept,Authorization,X-Requested-With,X-Tenant-ID,X-User-ID"),

			//MDMS API
			MDMS_API_URL:        getEnvOrDefault("MDMS_API_URL", ""),
		}
		// Validate critical configuration values
		validateConfig(instance)
	})
	return instance
}

// getEnvOrDefault retrieves the value of the environment variable or returns the default value if not set.
func getEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// validateConfig verifies that required configuration fields are present.
// It returns an error describing missing or invalid settings instead of
// terminating the process directly (caller decides how to handle it).
func validateConfig(cfg *Config) {
	if cfg.KeycloakBaseURL == "" || cfg.KeycloakAdminUsername == "" || cfg.KeycloakAdminPassword == "" {
		log.Fatalf("Critical Keycloak configuration is missing. Please check environment variables.")
	}
	if cfg.DBHost == "" || cfg.DBPort == "" || cfg.DBUser == "" || cfg.DBPassword == "" || cfg.DBName == "" {
		log.Fatalf("Critical database configuration is missing. Please check environment variables.")
	}
	log.Println("Configuration validated successfully")
}

