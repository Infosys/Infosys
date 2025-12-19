package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"property-tax-onboarding/internal/constants"
	"property-tax-onboarding/internal/errors"
	"property-tax-onboarding/internal/models"
	"property-tax-onboarding/internal/repositories"
	"property-tax-onboarding/pkg/logger"
	"strings"
	"time"
	"github.com/cenkalti/backoff/v4"
)

// KeycloakService handles interactions with the Keycloak identity provider.
//
// This service provides methods for managing users, roles, and tokens in Keycloak.
// It uses HTTP requests to interact with Keycloak's REST API.
type KeycloakService struct {
	BaseURL       string                      // Base URL of the Keycloak server.
	TokenURL      string                      // URL for obtaining admin tokens.
	UserURL       string                      // URL for managing users.
	AssignRoleURL string                      // URL for assigning roles to users.
	RoleURL       string                      // URL for retrieving a specific role.
	RolesURL      string                      // URL for retrieving roles assigned to a user.
	DeleteURL     string                      // URL for deleting users.
	AdminUser     string                      // Admin username for authentication.
	AdminPass     string                      // Admin password for authentication.
	ClientID      string                      // Client ID for authentication.
	ClientSecret  string                      // Client secret for authentication.
	Realm         string                      // Keycloak realm to operate in.
	httpClient    *http.Client                // HTTP client for making requests.
	userRepo      repositories.UserRepository // Repository for user data operations.
}

// KeycloakTokenResponse represents the token response from Keycloak.
//
// This struct is used to parse the JSON response when requesting an admin token.
type KeycloakTokenResponse struct {
	AccessToken string `json:"access_token"` // The access token.
	TokenType   string `json:"token_type"`   // The type of the token (e.g., Bearer).
	ExpiresIn   int    `json:"expires_in"`   // Token expiration time in seconds.
}

// NewKeycloakService creates a new instance of KeycloakService.
//
// Returns:
//   - A new instance of KeycloakService.
func NewKeycloakService(baseURL, tokenURL, userURL, assignRoleURL, roleURL, rolesURL, deleteURL, adminUser, adminPass, clientID, clientSecret, realm string, userRepo repositories.UserRepository) *KeycloakService {
	return &KeycloakService{
		BaseURL:       baseURL,
		TokenURL:      tokenURL,
		UserURL:       userURL,
		AssignRoleURL: assignRoleURL,
		RoleURL:       roleURL,
		RolesURL:      rolesURL,
		DeleteURL:     deleteURL,
		AdminUser:     adminUser,
		AdminPass:     adminPass,
		ClientID:      clientID,
		ClientSecret:  clientSecret,
		Realm:         realm,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		userRepo: userRepo,
	}
}

// GetAdminToken retrieves an admin access token from Keycloak.
//
// Returns:
//   - A string containing the admin access token.
//   - An error if the operation fails.
//
// Description:
// This method sends a POST request to the Keycloak token endpoint to obtain an admin token.
// It uses exponential backoff for retries in case of transient errors.
func (ks *KeycloakService) GetAdminToken() (string, error) {
	tokenURL := ks.TokenURL
	data := url.Values{}
	data.Set("grant_type", "password")
	data.Set("client_id", "admin-cli")
	data.Set("username", ks.AdminUser)
	data.Set("password", ks.AdminPass)

	var tokenResp KeycloakTokenResponse
	operation := func() error {
		req, err := http.NewRequest("POST", tokenURL, strings.NewReader(data.Encode()))
		if err != nil {
			errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrCreateToken, tokenURL))
			logger.Error(constants.ErrCreateToken, errMsg)
			return errMsg
		}
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

		resp, err := ks.httpClient.Do(req)
		if err != nil {
			errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrRequestToken, tokenURL))
			logger.Error(constants.ErrRequestToken, errMsg)
			return errMsg
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			body, _ := io.ReadAll(resp.Body)
			errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (status: %d, url: %s): %s", constants.ErrGetAdminToken, resp.StatusCode, tokenURL, string(body)))
			logger.Error(constants.ErrGetAdminToken, errMsg)
			return errMsg
		}

		if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
			errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrDecodeToken, tokenURL))
			logger.Error(constants.ErrDecodeToken, errMsg)
			return errMsg
		}
		return nil
	}

	// Retry with exponential backoff
	expBackoff := backoff.NewExponentialBackOff()
	expBackoff.MaxElapsedTime = 2 * time.Minute // Set max retry duration
	if err := backoff.Retry(operation, expBackoff); err != nil {
		return "", err
	}

	return tokenResp.AccessToken, nil
}

// ManageUserActivation manages the activation and deactivation of users based on their start_date and end_date.
//
// Returns:
//   - An error if any operation (fetching users, enabling, or disabling) fails, or nil if all operations succeed.
//Description:
// This method performs the following operations:
// 1. Enables users whose `start_date` is today.
// 2. Disables users whose `end_date` is today.
// 3. Disables users whose `start_date` is in the future.
func (ks *KeycloakService) ManageUserActivation() error {
    ctx := context.Background()
    today := time.Now().Format("2006-01-02")

    // Enable users with start_date = today
    usersToEnable, err := ks.userRepo.GetUsersByStartDate(ctx, today)
    if err != nil {
        return fmt.Errorf("error fetching users to enable: %w", err)
    }
    for _, user := range usersToEnable {
        if err := ks.EnableUser(user.KeycloakUserID); err != nil {
            return fmt.Errorf("error enabling user %s: %w", user.KeycloakUserID, err)
        }
    }

    // Disable users with end_date = today
    usersToDisable, err := ks.userRepo.GetUsersByEndDate(ctx, today)
    if err != nil {
        return fmt.Errorf("error fetching users to disable: %w", err)
    }
    for _, user := range usersToDisable {
        if err := ks.DisableUser(user.KeycloakUserID); err != nil {
            return fmt.Errorf("error disabling user %s: %w", user.KeycloakUserID, err)
        }
    }

	// Deactivate users with start_date > today
    usersWithFutureStartDate, err := ks.userRepo.GetUsersWithFutureStartDate(ctx, today)
    if err != nil {
        return fmt.Errorf("error fetching users with future start_date: %w", err)
    }
    for _, user := range usersWithFutureStartDate {
        if err := ks.DisableUser(user.KeycloakUserID); err != nil {
            return fmt.Errorf("error disabling user with future start_date %s: %w", user.KeycloakUserID, err)
        }
    }

    return nil
}

// CreateUser creates a new user in Keycloak.
//
// Parameters:
//   - user: A KeycloakUser object containing the user's details.
//
// Returns:
//   - A string containing the ID of the created user.
//   - An error if the operation fails.
//
// Description:
// This method sends a POST request to the Keycloak user endpoint to create a new user.
// It validates the input, retrieves an admin token, and handles errors appropriately.
func (ks *KeycloakService) CreateUser(user models.KeycloakUser) (string, error) {
	if user.Username == "" {
		errMsg := errors.NewKeycloakServiceError(constants.ErrEmptyUsername)
		logger.Error(constants.ErrEmptyUsername, errMsg)
		return "", errMsg
	}
	if user.Email == "" {
		errMsg := errors.NewKeycloakServiceError(constants.ErrEmptyEmail)
		logger.Error(constants.ErrEmptyEmail, errMsg)
		return "", errMsg
	}
	token, err := ks.GetAdminToken()
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrGetAdminToken)
		logger.Error(constants.ErrGetAdminToken, errMsg)
		return "", errMsg
	}

	userURL := ks.UserURL

	userJSON, err := json.Marshal(user)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrMarshalUserData)
		logger.Error(constants.ErrMarshalUserData, errMsg)
		return "", errMsg
	}

	req, err := http.NewRequest("POST", userURL, bytes.NewBuffer(userJSON))
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrCreateUserRequest)
		logger.Error(constants.ErrCreateUserRequest, errMsg)
		return "", errMsg
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := ks.httpClient.Do(req)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrCreateUser)
		logger.Error(constants.ErrCreateUser, errMsg)
		return "", errMsg
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (status: %d, url: %s): %s", constants.ErrCreateUser, resp.StatusCode, userURL, string(body)))
		logger.Error(constants.ErrCreateUser, errMsg)
		return "", errMsg
	}

	// Extract user ID from Location header
	location := resp.Header.Get("Location")
	if location == "" {
		errMsg := errors.NewKeycloakServiceError(constants.ErrNoLocationHeader)
		logger.Error(constants.ErrNoLocationHeader, errMsg)
		return "", errMsg
	}

	// Extract user ID from the location URL
	parts := strings.Split(location, "/")
	if len(parts) == 0 {
		errMsg := errors.NewKeycloakServiceError(constants.ErrInvalidLocation)
		logger.Error(constants.ErrInvalidLocation, errMsg)
		return "", errMsg
	}

	return parts[len(parts)-1], nil
}

// AssignRoleToUser assigns a role to a user in Keycloak.
//
// Parameters:
//   - userID: The ID of the user to whom the role will be assigned.
//   - roleName: The name of the role to assign.
//
// Returns:
//   - An error if the operation fails.
//
// Description:
// This method retrieves the role details and sends a POST request to assign the role to the user.
func (ks *KeycloakService) AssignRoleToUser(userID, roleName string) error {
	if userID == "" {
		errMsg := errors.NewKeycloakServiceError(constants.ErrEmptyUserID)
		logger.Error(constants.ErrEmptyUserID, errMsg)
		return errMsg
	}
	if roleName == "" {
		errMsg := errors.NewKeycloakServiceError(constants.ErrEmptyRoleName)
		logger.Error(constants.ErrEmptyRoleName, errMsg)
		return errMsg
	}
	token, err := ks.GetAdminToken()
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrGetAdminToken)
		logger.Error(constants.ErrGetAdminToken, errMsg)
		return errMsg
	}

	// Get role details
	role, err := ks.GetRole(roleName)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s: '%s': %v", constants.ErrGetRole, roleName, err))
		logger.Error(fmt.Sprintf("%s %s", constants.ErrGetRole, roleName), errMsg)
		return errMsg
	}

	// Assign role to user
	assignURL := fmt.Sprintf(ks.AssignRoleURL, userID)

	roleMapping := []models.KeycloakRole{*role}
	roleMappingJSON, err := json.Marshal(roleMapping)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrMarshalRole)
		logger.Error(constants.ErrMarshalRole, errMsg)
		return errMsg
	}

	req, err := http.NewRequest("POST", assignURL, bytes.NewBuffer(roleMappingJSON))
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrAssignRoleRequest)
		logger.Error(constants.ErrAssignRoleRequest, errMsg)
		return errMsg
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := ks.httpClient.Do(req)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrAssignRole)
		logger.Error(constants.ErrAssignRole, errMsg)
		return errMsg
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		body, _ := io.ReadAll(resp.Body)
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (status: %d, url: %s): %s", constants.ErrAssignRole, resp.StatusCode, assignURL, string(body)))
		logger.Error(constants.ErrAssignRole, errMsg)
		return errMsg
	}

	return nil
}

// GetRole retrieves a role by name from Keycloak.
//
// Parameters:
//   - roleName: The name of the role to retrieve.
//
// Returns:
//   - A pointer to a KeycloakRole object containing the role details.
//   - An error if the operation fails.
//
// Description:
// This method sends a GET request to the Keycloak role endpoint to retrieve the role details.
func (ks *KeycloakService) GetRole(roleName string) (*models.KeycloakRole, error) {
	token, err := ks.GetAdminToken()
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrGetAdminToken)
		logger.Error(constants.ErrGetAdminToken, errMsg)
		return nil, errMsg
	}

	roleURL := fmt.Sprintf(ks.RoleURL, roleName)

	req, err := http.NewRequest("GET", roleURL, nil)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrCreateRoleRequest, roleURL))
		logger.Error(constants.ErrCreateRoleRequest, errMsg)
		return nil, errMsg
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := ks.httpClient.Do(req)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrGetRole, roleURL))
		logger.Error(constants.ErrGetRole, errMsg)
		return nil, errMsg
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (status: %d, url: %s): %s", constants.ErrGetRole, resp.StatusCode, roleURL, string(body)))
		logger.Error(constants.ErrGetRole, errMsg)
		return nil, errMsg
	}

	var role models.KeycloakRole
	if err := json.NewDecoder(resp.Body).Decode(&role); err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrDecodeToken, roleURL))
		logger.Error(constants.ErrDecodeToken, errMsg)
		return nil, errMsg
	}

	return &role, nil
}

// GetUserByID retrieves a Keycloak user by their unique user ID.
//
// Parameters:
//   - userID: The unique identifier of the user in Keycloak.
//
// Returns:
//   - A pointer to the `KeycloakUser` object containing the user's details.
//   - An error if the operation fails, or if the user is expired.
//
// Description:
// This method performs the following operations:
// 1. Fetches the user details from Keycloak using the Keycloak Admin API.
// 2. Validates the `expiryDate` attribute (if present) to check if the user is expired.
// 3. If the user is expired, disables the user in Keycloak and returns an error.
func (ks *KeycloakService) GetUserByID(userID string) (*models.KeycloakUser, error) {
	token, err := ks.GetAdminToken()
	if err != nil {
		return nil, fmt.Errorf(constants.ErrGetAdminToken)
	}
	url := fmt.Sprintf("%s/admin/realms/%s/users/%s", ks.BaseURL, ks.Realm, userID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf(constants.ErrCreateUserRequest)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf(constants.ErrFetchKeycloakUser)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(constants.ErrKeycloakAPIStatus+": %d", resp.StatusCode)
	}

	var keycloakUser models.KeycloakUser
	if err := json.NewDecoder(resp.Body).Decode(&keycloakUser); err != nil {
		return nil, fmt.Errorf(constants.ErrDecodeKeycloakUser+": %w", err)
	}

	// Check expiryDate
	expiryDateInterface, exists := keycloakUser.Attributes["expiryDate"]
	if exists {
		expiryDateSlice, ok := expiryDateInterface.([]interface{})
		log.Printf("expiryDateInterface: %v, Type: %T\n", expiryDateInterface, expiryDateInterface)
		if !ok || len(expiryDateSlice) == 0 {
			return nil, fmt.Errorf("expiryDate attribute is missing or invalid for user %s", userID)
		}

		expiryDate, err := time.Parse("2006-01-02", expiryDateSlice[0].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid expiryDate format for user %s: %w", userID, err)
		}

		if time.Now().After(expiryDate) {
			// Disable the user in Keycloak
			if disableErr := ks.DisableUser(userID); disableErr != nil {
				return nil, fmt.Errorf("failed to disable expired user %s: %w", userID, disableErr)
			}

			return nil, fmt.Errorf("user %s is expired and has been disabled", userID)
		}
	}

	return &keycloakUser, nil
}

// GetUserRoles retrieves roles assigned to a user in Keycloak.
//
// Parameters:
//   - userID: The ID of the user whose roles are to be retrieved.
//
// Returns:
//   - A slice of KeycloakRole objects representing the user's roles.
//   - An error if the operation fails.
//
// Description:
// This method sends a GET request to the Keycloak roles endpoint to retrieve the user's roles.
func (ks *KeycloakService) GetUserRoles(userID string) ([]models.KeycloakRole, error) {
	token, err := ks.GetAdminToken()
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrGetAdminToken)
		logger.Error(constants.ErrGetAdminToken, errMsg)
		return nil, errMsg
	}

	rolesURL := fmt.Sprintf(ks.RolesURL, userID)

	req, err := http.NewRequest("GET", rolesURL, nil)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrCreateRoleRequest, rolesURL))
		logger.Error(constants.ErrCreateRoleRequest, errMsg)
		return nil, errMsg
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := ks.httpClient.Do(req)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrGetUserRoles, rolesURL))
		logger.Error(constants.ErrGetUserRoles, errMsg)
		return nil, errMsg
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (status: %d, url: %s): %s", constants.ErrGetUserRoles, resp.StatusCode, rolesURL, string(body)))
		logger.Error(constants.ErrGetUserRoles, errMsg)
		return nil, errMsg
	}

	var roles []models.KeycloakRole
	if err := json.NewDecoder(resp.Body).Decode(&roles); err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrDecodeToken, rolesURL))
		logger.Error(constants.ErrDecodeToken, errMsg)
		return nil, errMsg
	}

	return roles, nil
}

// DeleteUser deletes a user from Keycloak.
//
// Parameters:
//   - userID: The ID of the user to delete.
//
// Returns:
//   - An error if the operation fails.
//
// Description:
// This method sends a DELETE request to the Keycloak user endpoint to delete the specified user.
func (ks *KeycloakService) DeleteUser(userID string) error {
	// Get Keycloak token
	token, err := ks.GetAdminToken()
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(constants.ErrGetAdminToken)
		logger.Error(constants.ErrGetAdminToken, errMsg)
		return errMsg
	}

	// Construct URL for user deletion
	deleteURL := fmt.Sprintf(ks.DeleteURL, userID)

	// Create DELETE request
	req, err := http.NewRequest("DELETE", deleteURL, nil)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrDeleteUserRequest, deleteURL))
		logger.Error(constants.ErrDeleteUserRequest, errMsg)
		return errMsg
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	// Send request
	resp, err := ks.httpClient.Do(req)
	if err != nil {
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (url: %s)", constants.ErrDeleteUser, deleteURL))
		logger.Error(constants.ErrDeleteUser, errMsg)
		return errMsg
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		errMsg := errors.NewKeycloakServiceError(fmt.Sprintf("%s (status: %d, url: %s): %s", constants.ErrDeleteUserKeycloak, resp.StatusCode, deleteURL, string(body)))
		logger.Error(constants.ErrDeleteUserKeycloak, errMsg)
		return errMsg
	}

	return nil
}

// EnableUser enables a user in Keycloak and updates their `isActive` status in the database.
// Parameters:
//   - userID: The unique identifier of the user in Keycloak.
//
// Returns:
//   - An error if any operation fails, or nil if the user is successfully enabled.
//
// Description:
// This function interacts with the Keycloak Admin API to enable a user by setting their `enabled` attribute to `true`.
// It also updates the `isActive` field in the database to reflect the user's active status.
func (ks *KeycloakService) EnableUser(userID string) error {
	token, err := ks.GetAdminToken()
	if err != nil {
		return fmt.Errorf("failed to get admin token: %w", err)
	}

	url := fmt.Sprintf("%s/admin/realms/%s/users/%s", ks.BaseURL, ks.Realm, userID)
	reqBody := map[string]bool{"enabled": true}
	body, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request body: %w", err)
	}

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("Content-Type", "application/json")

	resp, err := ks.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to enable user in Keycloak: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		responseBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to enable user in Keycloak, status: %d, response: %s", resp.StatusCode, string(responseBody))
	}

	ctx := context.Background()
	if err := ks.userRepo.UpdateUserIsActive(ctx, userID, true); err != nil {
		return fmt.Errorf("failed to update isActive in database for user %s: %w", userID, err)
	}

	return nil
}

// DisableUser disables a user in Keycloak and updates their `isActive` status in the database.
//
// Parameters:
//   - userID: The unique identifier of the user in Keycloak.
//
// Returns:
//   - An error if any operation fails, or nil if the user is successfully disabled.
//
// Description:
// This function interacts with the Keycloak Admin API to disable a user by setting their `enabled` attribute to `false`.
// It also updates the `isActive` field in the database to reflect the user's inactive status.
func (ks *KeycloakService) DisableUser(userID string) error {
	token, err := ks.GetAdminToken()
	if err != nil {
		return fmt.Errorf(constants.ErrGetAdminToken)
	}

	url := fmt.Sprintf("%s/admin/realms/%s/users/%s", ks.BaseURL, ks.Realm, userID)

	reqBody := map[string]bool{"enabled": false}
	body, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf(constants.ErrCreateUserRequest)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("Content-Type", "application/json")

	resp, err := ks.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf(constants.ErrFetchKeycloakUser)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf(constants.ErrKeycloakAPIStatus+": %d", resp.StatusCode)
	}

	// Update isActive in the database 
	ctx := context.Background()
	if err := ks.userRepo.UpdateUserIsActive(ctx, userID, false); err != nil {
		return fmt.Errorf("failed to update isActive in database for user %s: %w", userID, err)
	}

	return nil
}
