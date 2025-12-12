// Package utils provides utility functions for Keycloak and other integrations.
// This file contains helpers for extracting and converting Keycloak attributes.
package utils

// ExtractStringAttribute extracts the first string value for a given key from Keycloak attributes.
// Returns the string if found, or an empty string if not present or not a string.

// Parameters:
//   - attributes: Keycloak attributes map (string to interface{})
//   - key: The attribute key to extract
// Returns:
//   - string: The first string value for the key, or "" if not found
func ExtractStringAttribute(attributes map[string]interface{}, key string) string {
	if attr, exists := attributes[key]; exists {
		if attrSlice, ok := attr.([]interface{}); ok && len(attrSlice) > 0 {
			if str, ok := attrSlice[0].(string); ok {
				return str
			}
		}
	}
	return ""
}
