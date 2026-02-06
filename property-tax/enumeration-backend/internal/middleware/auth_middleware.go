// Package middleware provides authentication and authorization middleware for the API
package middleware

import (
	"context"
	"encoding/json"
	"enumeration/internal/config"
	"enumeration/internal/constants"
	"enumeration/internal/dto"
	"enumeration/internal/security"
	"enumeration/pkg/logger"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// MDMSResponse represents the response structure from MDMS API
type MDMSResponse struct {
	MDMS []MDMSData `json:"mdms"`
}

// MDMSData holds individual MDMS API role data
type MDMSData struct {
	ID               string      `json:"id"`
	TenantID         string      `json:"tenantId"`
	SchemaCode       string      `json:"schemaCode"`
	UniqueIdentifier string      `json:"uniqueIdentifier"`
	Data             APIRoleData `json:"data"`
	IsActive         bool        `json:"isActive"`
}

// APIRoleData holds allowed roles for an API endpoint
type APIRoleData struct {
	Method       string   `json:"method"`
	Endpoint     string   `json:"endpoint"`
	AllowedRoles []string `json:"allowedRoles"`
}

// RoleActionData holds actions allowed for a role
type RoleActionData struct {
	Role    string   `json:"role"`
	Actions []string `json:"actions"`
}

// rolePermissions holds role-action permissions loaded from MDMS
var rolePermissions map[string][]string

// mdmsRolePermissions holds endpoint-role permissions loaded from MDMS
var mdmsRolePermissions map[string][]string

// Init loads role and endpoint permissions from MDMS at startup
func Init() {
	// Load role-action permissions from MDMS
	roleActionPermissions, err := loadRoleActionsFromMDMS()
	if err != nil {
		logger.Error("\nFailed to load role-action permissions from MDMS:\n", err)
	} else {
		rolePermissions = roleActionPermissions
		logger.Info("\nSuccessfully loaded role-action permissions from MDMS :\t", rolePermissions, "\n")
	}

	// Load MDMS API roles once at startup
	mdmsRoles, err := loadAllMDMSRoles()
	if err != nil {
		logger.Error("\nFailed to load MDMS API roles:\n", err)
		// Initialize empty map if MDMS fails
		mdmsRolePermissions = make(map[string][]string)
	} else {
		mdmsRolePermissions = mdmsRoles
		logger.Info("\nSuccessfully loaded MDMS API roles :\t", mdmsRolePermissions, "\n")
	}
}

// RoleMiddleware checks if the user has the necessary role to perform the action specified in the request.
func ActionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, roles, err := extractClaimsAndRoles(c)
		if err != nil {
			return
		}

		action, err := extractActionFromRequest(c)
		if err != nil {
			return
		}

		if isActionAllowedForRoles(roles, action) {
			c.Next()
			return
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access denied for this action"})
	}
}

// extractClaimsAndRoles extracts Keycloak claims and roles from the context
func extractClaimsAndRoles(c *gin.Context) (*security.KeycloakClaims, []string, error) {
	claimsVal, exists := c.Get("claims")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "MissingClaims"})
		return nil, nil, fmt.Errorf("missing claims")
	}
	claims, ok := claimsVal.(*security.KeycloakClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "InvalidClaimsType"})
		return nil, nil, fmt.Errorf("invalid claims type")
	}

	var roles []string
	if claims.RealmAccess != nil {
		if r, ok := claims.RealmAccess["roles"]; ok {
			roles = r
		}
	}
	if len(roles) == 0 {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "No roles found in token"})
		return nil, nil, fmt.Errorf("no roles found")
	}

	return claims, roles, nil
}

// extractActionFromRequest parses the action from the request body
func extractActionFromRequest(c *gin.Context) (string, error) {
	var req dto.ActionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request body",
			"errors":  []string{err.Error()},
		})
		return "", err
	}
	c.Set("actionRequest", req)
	return req.Action, nil
}

// isActionAllowedForRoles checks if any role allows the specified action
func isActionAllowedForRoles(roles []string, action string) bool {
	for _, role := range roles {
		if isActionAllowedForRole(role, action) {
			return true
		}
	}
	return false
}

// isActionAllowedForRole checks if a specific role allows the action
func isActionAllowedForRole(role, action string) bool {
	allowedActions, exists := rolePermissions[role]
	if !exists {
		return false
	}
	for _, a := range allowedActions {
		if a == action {
			return true
		}
	}
	return false
}

// AuthMiddleware validates JWT tokens and stores user claims in the Gin context
// Performs signature, issuer, and audience checks
func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenStr, err := extractBearerToken(ctx)
		if err != nil {
			return
		}

		claims, err := validateToken(ctx, tokenStr)
		if err != nil {
			return
		}

		if err := validateIssuer(ctx, claims); err != nil {
			return
		}

		if err := validateAudience(ctx, claims); err != nil {
			return
		}

		roles := extractRoles(claims)
		setContextValues(ctx, claims, roles)
		updateRequestContext(ctx, claims, roles)

		ctx.Next()
	}
}

// extractBearerToken extracts the bearer token from the Authorization header
func extractBearerToken(ctx *gin.Context) (string, error) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(strings.ToLower(authHeader), "bearer ") {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "MissingBearerToken"})
		return "", fmt.Errorf("missing bearer token")
	}
	return strings.TrimSpace(authHeader[len("Bearer "):]), nil
}

// validateToken parses and validates the JWT token
func validateToken(ctx *gin.Context, tokenStr string) (*security.KeycloakClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &security.KeycloakClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method %v", token.Header["alg"])
		}
		kid, _ := token.Header["kid"].(string)
		return security.GetPublicKey(ctx.Request.Context(), kid)
	})
	if err != nil || !token.Valid {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "InvalidToken", "details": err.Error()})
		return nil, err
	}
	claims, _ := token.Claims.(*security.KeycloakClaims)
	return claims, nil
}

// validateIssuer checks if the token issuer matches the expected issuer
func validateIssuer(ctx *gin.Context, claims *security.KeycloakClaims) error {
	base := os.Getenv("KEYCLOAK_BASE_URL")
	realm := os.Getenv("KEYCLOAK_REALM")
	if base == "" || realm == "" {
		return nil
	}
	expectedIssuer := strings.TrimRight(base, "/") + "/realms/" + realm
	if claims.Issuer != expectedIssuer {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "BadIssuer", "expected": expectedIssuer, "actual": claims.Issuer})
		return fmt.Errorf("invalid issuer")
	}
	return nil
}

// validateAudience checks if the token audience matches the expected client ID
func validateAudience(ctx *gin.Context, claims *security.KeycloakClaims) error {
	clientID := os.Getenv("KEYCLOAK_CLIENT_ID")
	if clientID == "" {
		return nil
	}

	strictAud := strings.ToLower(os.Getenv("KEYCLOAK_STRICT_AUD")) == "true"
	if !strictAud {
		return nil
	}

	audOK := isAudienceValid(claims, clientID)
	if !audOK {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "BadAudience", "expected": clientID, "aud": claims.Audience, "azp": claims.AuthorizedParty})
		return fmt.Errorf("invalid audience")
	}
	return nil
}

// isAudienceValid checks if the clientID is in audience or authorized party
func isAudienceValid(claims *security.KeycloakClaims, clientID string) bool {
	for _, a := range claims.Audience {
		if a == clientID {
			return true
		}
	}
	return claims.AuthorizedParty == clientID
}

// extractRoles retrieves roles from the claims
func extractRoles(claims *security.KeycloakClaims) []string {
	var roles []string
	if claims.RealmAccess != nil {
		if r, ok := claims.RealmAccess["roles"]; ok {
			roles = r
		}
	}
	return roles
}

// setContextValues sets user information in the Gin context
func setContextValues(ctx *gin.Context, claims *security.KeycloakClaims, roles []string) {
	logger.Info("Authenticated user:", claims.PreferredUsername, " with roles: ", claims.RealmAccess["roles"])
	ctx.Set("claims", claims)
	ctx.Set("user", claims.PreferredUsername)
	ctx.Set("roles", roles)
	if len(roles) > 0 {
		ctx.Set("role", roles[0])
	}
}

// updateRequestContext updates the request context with user information
func updateRequestContext(ctx *gin.Context, claims *security.KeycloakClaims, roles []string) {
	reqCtx := ctx.Request.Context()
	reqCtx = context.WithValue(reqCtx, "user", claims.PreferredUsername)
	reqCtx = context.WithValue(reqCtx, "roles", roles)

	selectedRole := selectUppercaseRole(roles)
	if selectedRole != "" {
		reqCtx = context.WithValue(reqCtx, "role", selectedRole)
	}

	ctx.Request = ctx.Request.WithContext(reqCtx)
}

// selectUppercaseRole finds the first uppercase role from the roles list
func selectUppercaseRole(roles []string) string {
	for _, r := range roles {
		if r == strings.ToUpper(r) {
			return r
		}
	}
	return ""
}

// MDMSRoleMiddleware checks roles based on MDMS API configuration
func MDMSRoleMiddleware(method, endpoint string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get allowed roles from pre-loaded MDMS cache
		allowedRoles := getAllowedRolesFromCache(method, endpoint)

		// If no roles found in MDMS cache, deny access
		if len(allowedRoles) == 0 {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error":    "No roles configured for this endpoint",
				"endpoint": endpoint,
				"method":   method,
			})
			return
		}

		// Use security.RequireRoles middleware with the cached roles
		roleMiddleware := security.RequireRoles(allowedRoles...)
		roleMiddleware(c)
	}
}

// getAllowedRolesFromCache fetches allowed roles from the pre-loaded cache
func getAllowedRolesFromCache(method, endpoint string) []string {
	uniqueIdentifier := fmt.Sprintf("%s.%s", endpoint, method)
	if roles, exists := mdmsRolePermissions[uniqueIdentifier]; exists {
		return roles
	}
	return []string{}
}

// loadAllMDMSRoles loads all MDMS roles once at startup
func loadAllMDMSRoles() (map[string][]string, error) {
	mdmsURL := config.GetConfig().MDMSURL
	url := fmt.Sprintf("%s/mdms-v2/v2?schemaCode=API_ROLES", mdmsURL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	// Add required headers
	req.Header.Set("X-Tenant-ID", "pg")
	req.Header.Set("X-Client-Id", "test-client")

	// Make the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Read and parse response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var mdmsResponse MDMSResponse
	if err := json.Unmarshal(body, &mdmsResponse); err != nil {
		return nil, err
	}

	// Build cache map
	roleCache := make(map[string][]string)
	for _, mdmsData := range mdmsResponse.MDMS {
		if mdmsData.IsActive {
			roleCache[mdmsData.UniqueIdentifier] = mdmsData.Data.AllowedRoles
		}
	}

	return roleCache, nil
}

// loadRoleActionsFromMDMS loads role-action permissions from MDMS API_ROLE_ACTION schema
func loadRoleActionsFromMDMS() (map[string][]string, error) {
	mdmsURL := config.GetConfig().MDMSURL
	url := fmt.Sprintf("%s/mdms-v2/v2?schemaCode=API_ROLE_ACTION", mdmsURL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	// Add required headers
	req.Header.Set("X-Tenant-ID", constants.DefaultJurisdiction)
	req.Header.Set("X-Client-Id", "test-client")

	// Make the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Read and parse response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Parse as role-action data structure
	var roleActionResponse struct {
		MDMS []struct {
			ID               string         `json:"id"`
			TenantID         string         `json:"tenantId"`
			SchemaCode       string         `json:"schemaCode"`
			UniqueIdentifier string         `json:"uniqueIdentifier"`
			Data             RoleActionData `json:"data"`
			IsActive         bool           `json:"isActive"`
		} `json:"mdms"`
	}

	if err := json.Unmarshal(body, &roleActionResponse); err != nil {
		return nil, err
	}

	// Build role permissions map
	rolePermissions := make(map[string][]string)
	for _, mdmsData := range roleActionResponse.MDMS {
		if mdmsData.IsActive {
			rolePermissions[mdmsData.Data.Role] = mdmsData.Data.Actions
		}
	}

	return rolePermissions, nil
}
