package utils

import (
	"enumeration/internal/security"
	"strings"
	"github.com/gin-gonic/gin"
)

// Extracts username and role from gin context
func GetUserInfoFromContext(c *gin.Context) (username string, role string) {
	username = ""
	role = ""

	if claimsVal, exists := c.Get("claims"); exists {
		if claims, ok := claimsVal.(*security.KeycloakClaims); ok {
			username = claims.PreferredUsername
		}
	}

	if roleVal, exists := c.Get("role"); exists {
		if roleStr, ok := roleVal.(string); ok {
			role = strings.ToUpper(roleStr)
		}
	}

	return username, role
}
