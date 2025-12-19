// Package handlers contains HTTP handler functions for user-related API endpoints.
// It acts as the entry point for request processing, validation, and response formatting.
package handlers

import (
	"fmt"
	"net/http"
	"property-tax-onboarding/internal/constants"
	"property-tax-onboarding/internal/models"
	"property-tax-onboarding/internal/services"
	"property-tax-onboarding/pkg/logger"
	"property-tax-onboarding/pkg/response"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// UserHandler handles HTTP requests for user operations.
// It delegates business logic to the UserService.
type UserHandler struct {
	userService *services.UserService
}

// NewUserHandler creates a new instance of UserHandler with the provided UserService.
// Parameters:
//
//	-userService: An instance of UserService to handle business logic related to users.
//
// Returns:
//
//	-A pointer to the newly created UserHandler instance.
func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// HealthCheck handles health check requests
// It responds with the service status and version information.
func (uh *UserHandler) HealthCheck(c *gin.Context) {
	logger.Info(constants.LogHealthCheckRequested)

	healthResponse := gin.H{
		"status":  constants.ServiceStatus,
		"service": constants.ServiceName,
		"version": constants.ServiceVersion,
	}

	response.Success(c, http.StatusOK, constants.SuccessMsgServiceHealthy, healthResponse)
}

// CreateUser handles unified user creation requests for all user roles.
//
// This endpoint creates a new user in both Keycloak (for authentication) and the local database
// (for profile storage). It supports all user roles: AGENT, CITIZEN, COMMISSIONER, and SERVICE_MANAGER.
// The request is validated using Gin binding tags before processing.
//
// Parameters:
//   - c: Gin context containing the HTTP request with JSON payload matching CreateUserRequest.
//
// Request Body:
//   - CreateUserRequest JSON payload with username, email, password, role, profile, and optional zone/ward data.
//
// Returns:
//   - HTTP 201 (Created) with UserResponse on success.
//   - HTTP 400 (Bad Request) if validation fails or user creation fails.

func (uh *UserHandler) CreateUser(c *gin.Context) {
	logger.Info(constants.LogCreateUserRequest)

	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Error(constants.LogInvalidRequestPayload, "error", err)
		response.Error(c, http.StatusBadRequest, constants.ErrMsgInvalidRequestPayload, err.Error())
		return
	}

	ctx := c.Request.Context()
	userResponse, err := uh.userService.CreateUser(ctx, &req)
	if err != nil {
		logger.Error(constants.LogFailedToCreateUser, "error", err, "role", req.Role)
		response.Error(c, http.StatusBadRequest, constants.ErrMsgFailedToCreateUser, err.Error())
		return
	}

	logger.Info(constants.LogUserCreatedSuccess, "username", req.Username, "role", req.Role)
	response.Success(c, http.StatusCreated, constants.SuccessMsgUserCreated, userResponse)
}

// GetUser handles unified user retrieval requests by Keycloak user ID or username.
//
// This endpoint fetches user details from the database using either the Keycloak user ID
// (UUID format) or the username. It returns the complete user profile including zone/ward
// mappings and address information.
//
// Parameters:
//   - c: Gin context with URL parameter "id" (Keycloak user ID or username).
//
// URL Parameter:
//   - id: User identifier (Keycloak UUID or username).
//
// Returns:
//   - HTTP 200 (OK) with UserResponse on success.
//   - HTTP 404 (Not Found) if user does not exist.
//   - HTTP 400 (Bad Request) if identifier is missing.
//   - HTTP 500 (Internal Server Error) for other failures.

func (uh *UserHandler) GetUser(c *gin.Context) {
	identifier := c.Param("id")
	logger.Info(constants.LogGetUserRequest, "identifier", identifier)

	if identifier == "" {
		response.Error(c, http.StatusBadRequest, constants.ErrMsgMissingUserID, constants.ErrMsgMissingUserIDDetail)
		return
	}
	userResponse, err := uh.userService.GetUser(c.Request.Context(), identifier)
	if err != nil {
		logger.Error(constants.LogFailedToGetUser, "error", err, "identifier", identifier)
		response.Error(c, http.StatusInternalServerError, "Failed to get user", err.Error())
		return
	}
	logger.Info(constants.LogUserRetrievedSuccess, "identifier", identifier)
	response.Success(c, http.StatusOK, constants.SuccessMsgUserRetrieved, userResponse)
}

// GetUsersByRole handles paginated user retrieval filtered by role.
//
// This endpoint fetches users matching a specific role with optional pagination.
// Supported roles: AGENT, CITIZEN, COMMISSIONER, SERVICE_MANAGER (case-insensitive).
//
// Parameters:
//   - c: Gin context with URL parameter "role" and optional query parameters "limit" and "offset".
//
// URL Parameter:
//   - role: User role (AGENT, CITIZEN, COMMISSIONER, or SERVICE_MANAGER).
//
// Query Parameters:
//   - limit: Number of results per page (default: 10, max: 100).
//   - offset: Number of results to skip (default: 0).
//
// Returns:
//   - HTTP 200 (OK) with array of UserResponse objects.
//   - HTTP 400 (Bad Request) if role is invalid.
//   - HTTP 500 (Internal Server Error) for database errors.

func (uh *UserHandler) GetUsersByRole(c *gin.Context) {
	roleStr := c.Param("role")
	logger.Info("Raw role parameter from URL", "roleStr", roleStr)

	role := models.UserRole(strings.ToUpper(roleStr))
	if !isValidRole(role) {
		response.Error(c, http.StatusBadRequest, constants.ErrMsgInvalidRole, constants.ErrMsgInvalidRoleDetail)
		return
	}

	limit, offset := parsePagination(c)

	users, err := uh.userService.GetUsersByRole(c.Request.Context(), role, limit, offset)
	if err != nil {
		logger.Error(constants.LogFailedToGetUsersByRole, "error", err, "role", role)
		response.Error(c, http.StatusInternalServerError, constants.ErrMsgFailedToGetUsers, err.Error())
		return
	}

	logger.Info(constants.LogUsersRetrievedSuccess, "role", role, "count", len(users))
	response.Success(c, http.StatusOK, constants.SuccessMsgUsersRetrieved, users)
}

// DeleteUser handles user deletion requests by Keycloak user ID.
//
// This endpoint performs a soft delete by marking the user as inactive in both Keycloak
// and the local database. The user record is retained for audit purposes but cannot log in.
//
// Parameters:
//   - c: Gin context with URL parameter "id" (Keycloak user ID).
//
// URL Parameter:
//   - id: Keycloak user ID.
//
// Returns:
//   - HTTP 200 (OK) on successful deletion.
//   - HTTP 404 (Not Found) if user does not exist.
//   - HTTP 500 (Internal Server Error) for other failures.
func (uh *UserHandler) DeleteUser(c *gin.Context) {
	keycloakUserID := c.Param("id")
	logger.Info(constants.LogDeleteUserRequest, "keycloakUserID", keycloakUserID)

	if err := uh.userService.DeleteUserByKeycloakID(keycloakUserID); err != nil {
		logger.Error(constants.LogFailedToDeleteUser, "error", err, "keycloakUserID", keycloakUserID)

		if err.Error() == fmt.Sprintf("user not found with keycloak_user_id: %s", keycloakUserID) {
			response.Error(c, http.StatusNotFound, constants.ErrMsgUserNotFound, err.Error())
			return
		}
		response.Error(c, http.StatusInternalServerError, constants.ErrMsgFailedToDeleteUser, err.Error())
		return
	}
	logger.Info("User deleted successfully", "keycloakUserID", keycloakUserID)
	response.Success(c, http.StatusOK, "User deleted successfully", nil)
}

// UpdateUser handles user profile update requests by Keycloak user ID.
// This endpoint updates user details in both Keycloak (email, role) and the local database
// (profile fields, address, zone/ward mappings). All fields in UpdateUserRequest are optional
// except email and role.
// Parameters:
//   - c: Gin context with URL parameter "id" and JSON body matching UpdateUserRequest.
//
// URL Parameter:
//   - id: Keycloak user ID.
//
// Request Body:
//   - UpdateUserRequest JSON payload with fields to update.
//
// Returns:
//   - HTTP 200 (OK) with updated UserResponse on success.
//   - HTTP 400 (Bad Request) if validation fails.
//   - HTTP 404 (Not Found) if user does not exist.
func (uh *UserHandler) UpdateUser(c *gin.Context) {
	keycloakUserID := c.Param("id")
	logger.Info(constants.LogUpdateUserRequest, "keycloakUserID", keycloakUserID)

	var updateReq models.UpdateUserRequest
	if err := c.ShouldBindJSON(&updateReq); err != nil {
		logger.Error(constants.LogInvalidRequestBody, "error", err)
		response.Error(c, http.StatusBadRequest, constants.ErrMsgInvalidRequestBody, err.Error())
		return
	}

	logger.Info(constants.LogUpdateRequestDetails, "email", updateReq.Email, "role", updateReq.Role, "preferredLanguage", updateReq.PreferredLanguage)

	updatedUser, err := uh.userService.UpdateUserComplete(keycloakUserID, &updateReq)
	if err != nil {
		logger.Error(constants.LogFailedToUpdateUser, "error", err, "keycloakUserID", keycloakUserID)
		if err.Error() == "user not found" {
			response.Error(c, http.StatusNotFound, constants.ErrMsgUserNotFound, err.Error())
			return
		}

		response.Error(c, http.StatusBadRequest, constants.ErrMsgFailedToUpdateUser, err.Error())
		return
	}

	logger.Info(constants.LogUserUpdatedSuccess, "keycloakUserID", keycloakUserID)
	response.Success(c, http.StatusOK, constants.SuccessMsgUserUpdated, updatedUser)
}

// GetAllUsers handles paginated user retrieval with optional filters.
//
// This endpoint supports filtering users by role, active status, username, email, ward,
// and phone number. Results are paginated with configurable limit and offset.
//
// Parameters:
//   - c: Gin context with optional query parameters for filtering and pagination.
//
// Query Parameters (all optional):
//   - role: Filter by user role (AGENT, CITIZEN, COMMISSIONER, SERVICE_MANAGER).
//   - isActive: Filter by active status (true/false).
//   - username: Partial match on username (case-insensitive).
//   - email: Partial match on email (case-insensitive).
//   - ward: Filter by assigned ward.
//   - phoneNumber: Exact match on 10-digit phone number.
//   - limit: Results per page (default: 10, max: 100).
//   - offset: Number of results to skip (default: 0).
func (uh *UserHandler) GetAllUsers(c *gin.Context) {
	logger.Info("Get all users request received")

	var filters models.UserFilters

	// Role filter
	if roleStr := c.Query("role"); roleStr != "" {
		roleLisdt := strings.Split(roleStr, ",")
		var roles []models.UserRole
		for _, r := range roleLisdt {
			role := models.UserRole(strings.ToUpper(strings.TrimSpace(r)))
			if !isValidRole(role) {
				response.Error(c, http.StatusBadRequest, constants.ErrMsgInvalidRole, constants.ErrMsgInvalidRoleDetail)
				return
			}
			roles = append(roles, role)
		}
		if len(roles) > 0 {
			filters.Role = roles
		}
	}

	// IsActive filter
	if isActiveStr := c.Query("is_active"); isActiveStr != "" {
		if isActive, err := strconv.ParseBool(isActiveStr); err == nil {
			filters.IsActive = &isActive
		} else {
			response.Error(c, http.StatusBadRequest, constants.ErrMsgInvalidIsActive, constants.ErrMsgInvalidIsActiveDetail)
			return
		}
	}

	// Username filter (partial match)
	if username := c.Query("username"); username != "" {
		filters.Username = &username
	}

	// Email filter (partial match)
	if email := c.Query("email"); email != "" {
		filters.Email = &email
	}

	// Ward filter
	if ward := c.Query("ward"); ward != "" {
		wardlist := strings.Split(ward, ",")
		filters.Ward = &wardlist
	}

	if phoneNumber := c.Query("phoneNumber"); phoneNumber != "" {
		// Validate phone number format (10 digits)
		if len(strings.TrimSpace(phoneNumber)) != 10 {
			response.Error(c, http.StatusBadRequest, constants.ErrMsgInvalidPhoneNumber, constants.ErrMsgInvalidPhoneDetail)
			return
		}
		filters.PhoneNumber = &phoneNumber
	}

	limit, offset := parsePagination(c)

	logger.Info(constants.LogParsedFilters, "role", filters.Role, "isActive", filters.IsActive, "username", filters.Username, "email", filters.Email, "ward", filters.Ward, "limit", limit, "offset", offset)

	usersResponse, err := uh.userService.GetAllUsersWithFilters(c.Request.Context(), filters, limit, offset)
	if err != nil {
		logger.Error(constants.LogFailedToGetUsersFilters, "error", err)

		// Check if error is "no users found"
		if strings.Contains(err.Error(), "no users found") {
			response.Error(c, http.StatusNotFound, "No users found", err.Error())
			return
		}

		// Other errors
		response.Error(c, http.StatusInternalServerError, "Failed to get users", err.Error())
		return
	}

	logger.Info("Users retrieved successfully", "totalCount", usersResponse.TotalCount, "returnedCount", len(usersResponse.Users))
	response.Success(c, http.StatusOK, "Users retrieved successfully", usersResponse)
}

// parsePagination extracts pagination parameters (limit, offset) from the request query.
// Applies defaults and enforces max limits to prevent overload.
func parsePagination(c *gin.Context) (int, int) {
	limitStr := c.DefaultQuery("limit", strconv.Itoa(constants.DefaultPageLimit))
	offsetStr := c.DefaultQuery("offset", strconv.Itoa(constants.DefaultOffset))

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = constants.DefaultPageLimit
	}
	if limit > constants.MaxPageLimit {
		limit = constants.MaxPageLimit
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = constants.DefaultOffset
	}

	return limit, offset
}

// isValidRole checks if the provided role is a valid user role for this service.
// Used to validate input and prevent invalid role queries.
func isValidRole(role models.UserRole) bool {
	switch role {
	case models.RoleAgent, models.RoleCitizen, models.RoleCommissioner, models.RoleServiceManager, models.RoleAdmin:
		return true
	default:
		return false
	}
}

// GetUserCounts handles requests to retrieve counts of users.
//
// This endpoint returns counts for:
// - Total users (excluding deleted)
// - Active users (is_active = true)
// - Field agents (role = AGENT)
//
// Parameters:
//   - c: Gin context for the HTTP request.
//
// Returns:
//   - HTTP 200 (OK) with count statistics.
//   - HTTP 500 (Internal Server Error) if the operation fails.
func (uh *UserHandler) GetUserCounts(c *gin.Context) {
	logger.Info("Get user counts request received")

	counts, err := uh.userService.GetUserCounts(c.Request.Context())
	if err != nil {
		logger.Error("Failed to get user counts", "error", err)
		response.Error(c, http.StatusInternalServerError, "Failed to get user counts", err.Error())
		return
	}

	logger.Info("User counts retrieved successfully", "counts", counts)
	response.Success(c, http.StatusOK, "User counts retrieved successfully", counts)
}
