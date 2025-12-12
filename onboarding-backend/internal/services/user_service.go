// Package services contains the business logic for the application.
// It interacts with repositories, external services, and utilities to perform operations.
package services

import (
	"context"
	"fmt"
	"property-tax-onboarding/internal/constants"
	"property-tax-onboarding/internal/errors"
	"property-tax-onboarding/internal/models"
	"property-tax-onboarding/internal/repositories"
	"property-tax-onboarding/internal/utils"
	"property-tax-onboarding/internal/validator"
	"property-tax-onboarding/pkg/logger"
	"strings"
	"github.com/lib/pq"
)

// UserService provides methods to manage users, including creation, retrieval, and updates.
// It interacts with Keycloak, the database, and other services.
type UserService struct {
	keycloakService       *KeycloakService                   // Service for interacting with Keycloak.
	userRepository        repositories.UserRepository        // Repository for user-related database operations.
	zoneMappingRepository repositories.ZoneMappingRepository // Repository for zone mapping operations.
	validationService     *validator.UserValidationService   // Service for validating user-related requests.
}

// NewUserService creates a new instance of UserService with the provided dependencies.
//
// Parameters:
//   - keycloakService: Service for interacting with Keycloak.
//   - userRepo: Repository for user-related database operations.
//   - validationService: Service for validating user-related requests.
//   - zoneMappingRepo: Repository for zone mapping operations.
//
// Returns:
//   - A new instance of UserService.
func NewUserService(keycloakService *KeycloakService, userRepo repositories.UserRepository, validationService *validator.UserValidationService, zoneMappingRepo repositories.ZoneMappingRepository) *UserService {
	return &UserService{
		keycloakService:       keycloakService,
		userRepository:        userRepo,
		validationService:     validationService,
		zoneMappingRepository: zoneMappingRepo,
	}
}

// CreateUser creates a new user in the system and Keycloak.
// It validates the request, creates the user in Keycloak, assigns roles, and saves the user in the database.
//
// Parameters:
//   - ctx: Context for managing request-scoped values.
//   - req: Request object containing user details.
//
// Returns:
//   - A UserResponse object containing the created user's details.
//   - An error if the operation fails.
func (userService *UserService) CreateUser(ctx context.Context, req *models.CreateUserRequest) (*models.UserResponse, error) {
	logger.Info(constants.LogCreateUserStart, "username", req.Username, "role", req.Role)

	if req.Role == models.RoleCitizen && (req.Password == "" || req.Password == "null") {
		req.Password = "8472"
		logger.Info("Set default password for CITIZEN role", "username", req.Username)
	}

	// Validate request
	if err := userService.validationService.ValidateCreateUserRequest(req); err != nil {
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrValidationFailed, err))
	}

	// Create user in Keycloak
	logger.Info(constants.LogCreateUserKeycloak, "username", req.Username)
	keycloakUser := userService.buildKeycloakUser(req)
	keycloakUserID, err := userService.keycloakService.CreateUser(keycloakUser)
	if err != nil {
		logger.Error(constants.ErrCreateKeycloakUser, "error", err)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrCreateKeycloakUser, err))
	}
	// Flag to track if we need to rollback Keycloak user
	keycloakUserCreated := true
	defer func() {
		// Rollback Keycloak user if database operations fail
		if keycloakUserCreated && err != nil {
			logger.Warn(constants.LogRollbackKeycloakUser, "keycloakUserID", keycloakUserID)
			if deleteErr := userService.keycloakService.DeleteUser(keycloakUserID); deleteErr != nil {
				logger.Error(constants.ErrDeleteUserKeycloak, "error", deleteErr, "keycloakUserID", keycloakUserID)
			} else {
				logger.Info(constants.LogRollbackKeycloakUser, "keycloakUserID", keycloakUserID)
			}
		}
	}()

	// Assign role to user in Keycloak
	logger.Info(constants.LogAssignRoleToUser, "userID", keycloakUserID, "role", req.Role)
	if err := userService.keycloakService.AssignRoleToUser(keycloakUserID, string(req.Role)); err != nil {
		logger.Error(constants.ErrAssignRoleToUser, "error", err, "userID", keycloakUserID, "role", req.Role)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrAssignRoleToUser, err))
	}

	// Start database transaction
	logger.Info(constants.LogBeginTransaction)
	tx, err := userService.userRepository.BeginTransaction(ctx)
	if err != nil {
		logger.Error(constants.ErrBeginTransaction, "error", err)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrBeginTransaction, err))
	}
	if tx == nil {
		err = errors.NewServiceError(constants.ErrBeginTransaction)
		return nil, err
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			err = errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrBeginTransaction, r))
			logger.Error("error", err)
		}
	}()

	// Save user to database
	logger.Info(constants.LogSaveUserToDatabase, "userID", keycloakUserID)
	user, createErr := models.CreateUserFromRequest(req, keycloakUserID)
	if createErr != nil {
		tx.Rollback()
		logger.Error(constants.ErrCreateUserFromRequest, "error", createErr, "userID", keycloakUserID)
		err = errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrCreateUserFromRequest, createErr))
		return nil, err
	}

	if createErr = tx.Create(user); createErr != nil {
		tx.Rollback()
		logger.Error(constants.ErrSaveUserToDatabase, "error", createErr, "userID", keycloakUserID)
		err = errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrSaveUserToDatabase, createErr))
		return nil, err
	}

	// Create UserProfile
	logger.Info(constants.LogSaveUserProfile, "userID", keycloakUserID)
	userProfile := models.CreateUserProfileFromRequest(&req.Profile, keycloakUserID)
	if createErr = tx.CreateUserProfile(userProfile); createErr != nil {
		tx.Rollback()
		logger.Error(constants.ErrSaveUserProfile, "error", createErr, "userID", keycloakUserID)
		err = errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrSaveUserProfile, createErr))
		return nil, err
	}

	// Commit transaction
	logger.Info(constants.LogCommitTransaction, "userID", keycloakUserID)
	if commitErr := tx.Commit(); commitErr != nil {
		logger.Error(constants.ErrCommitTransaction, "error", commitErr, "userID", keycloakUserID)
		err = errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrCommitTransaction, commitErr))
		return nil, err
	}

	// Transaction successful, don't rollback Keycloak user
	keycloakUserCreated = false
	logger.Info(constants.LogUserCreatedSuccessfully, "userID", keycloakUserID, "role", req.Role)

	// Step 1: Validate zones and wards
	logger.Info(constants.LogZoneValidationStart)
	for _, zone := range req.ZoneData {
		_, err := userService.ValidateZoneAndWards(zone.ZoneNumber, zone.Wards)
		if err != nil {
			logger.Error(constants.ErrZoneValidationFailed, "error", err, "zone", zone.ZoneNumber)
			return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrZoneValidationFailed, err))
		}
	}

	// Step 2: Insert zone mappings
	logger.Info(constants.LogInsertZoneMappings, "userID", keycloakUserID)
	zoneMappings := make([]models.ZoneMapping, len(req.ZoneData))
	for i, zone := range req.ZoneData {
		zoneMappings[i] = models.ZoneMapping{
			Zone:  zone.ZoneNumber,
			Wards: pq.StringArray(zone.Wards),
		}
	}

	if err := userService.InsertZoneMappings(ctx, keycloakUserID, zoneMappings); err != nil {
		logger.Error(constants.ErrInsertZoneMappings, "error", err, "userID", keycloakUserID)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrInsertZoneMappings, err))
	}

	// Create response
	response := &models.UserResponse{}
	response.CreateUserResponse(user, userProfile)

	// Fetch and populate zone data
	logger.Info(constants.LogFetchZoneMappings, "userID", keycloakUserID)
	zoneData, err := userService.GetZoneMappingsByUserID(ctx, keycloakUserID)
	if err != nil {
		logger.Error(constants.ErrFetchZoneMappings, "error", err, "userID", keycloakUserID)
	} else {
		response.ZoneData = zoneData
	}

	// Fetch and populate address if AddressID exists
	if userProfile != nil && userProfile.AddressID != nil {
		logger.Info(constants.LogFetchAddress, "userID", keycloakUserID)
		userService.populateAddress(ctx, response, *userProfile.AddressID)
	}

	return response, nil
}

// buildKeycloakUser creates a KeycloakUser object from a CreateUserRequest.
//
// Parameters:
//   - req: Request object containing user details.
//
// Returns:
//   - A KeycloakUser object populated with the request details.
func (userService *UserService) buildKeycloakUser(req *models.CreateUserRequest) models.KeycloakUser {
	attributes := map[string]interface{}{
		"phoneNumber": []string{req.Profile.PhoneNumber},
		"userType":    []string{string(req.Role)},
	}

	return models.KeycloakUser{
		Username:      req.Username,
		Email:         req.Email,
		EmailVerified: true,
		FirstName:     req.Profile.FirstName,
		LastName:      req.Profile.LastName,
		Enabled:       true,
		Attributes:    attributes,
		Credentials: []models.KeycloakCredential{
			{
				Type:      "password",
				Value:     req.Password,
				Temporary: false,
			},
		},
	}
}

// GetUser retrieves a user by their identifier (Keycloak ID or username).
//
// Parameters:
//   - ctx: Context for managing request-scoped values.
//   - identifier: The unique identifier of the user (Keycloak ID or username).
//
// Returns:
//   - A UserResponse object containing the user's details.
//   - An error if the operation fails.
func (userService *UserService) GetUser(ctx context.Context, identifier string) (*models.UserResponse, error) {
	logger.Info(constants.LogRetrieveUserStart, "identifier", identifier)

	// Check if userRepository is available
	if userService.userRepository == nil {
		return nil, errors.NewServiceError(constants.ErrUserRepositoryUnavailable)
	}

	var user *models.User
	var err error

	// Try to get user by Keycloak ID first, then by username
	if len(identifier) > 30 {
		user, err = userService.userRepository.GetByKeycloakUserID(ctx, identifier)
	} else {
		logger.Error(constants.LogRetrieveUserByUsernameFailed, "identifier", identifier)
	}

	if err != nil {
		logger.Error(constants.ErrUserNotFound, "error", err, "identifier", identifier)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrUserNotFound, err))
	}

	// Check if the user is enabled in Keycloak
	keycloakUser, err := userService.keycloakService.GetUserByID(user.KeycloakUserID)
	if err != nil {
		logger.Error(constants.ErrFetchKeycloakUser, "error", err, "userID", user.KeycloakUserID)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrFetchKeycloakUser, err))
	}

	if !keycloakUser.Enabled {
		logger.Warn("User is disabled in Keycloak", "userID", user.KeycloakUserID)
		return nil, errors.NewServiceError("User is disabled in Keycloak")
	}

	// Get user profile
	userProfile, err := userService.userRepository.GetUserProfileByUserID(ctx, user.KeycloakUserID)
	if err != nil {
		logger.Warn(constants.LogRetrieveUserProfileFailed, "error", err, "userID", user.KeycloakUserID)
		userProfile = nil // Continue without profile if not found
	}

	// Get user roles from Keycloak
	roles, err := userService.keycloakService.GetUserRoles(user.KeycloakUserID)
	if err != nil {
		logger.Warn(constants.LogRetrieveUserRolesFailed, "error", err, "userID", user.KeycloakUserID)
		roles = []models.KeycloakRole{} // Default to empty roles
	}

	// Convert roles to string slice
	roleNames := make([]string, len(roles))
	for i, role := range roles {
		roleNames[i] = role.Name
	}

	// Create the user response
	response := &models.UserResponse{}
	response.CreateUserResponse(user, userProfile) // Use new signature with userProfile

	// Fetch and populate zone data
	zoneData, err := userService.GetZoneMappingsByUserID(ctx, user.KeycloakUserID)
	if err != nil {
		logger.Error(constants.LogFetchZoneMappingsFailed, "error", err, "userID", user.KeycloakUserID)
	} else {
		response.ZoneData = zoneData
	}

	// Fetch and populate address if AddressID exists
	if userProfile != nil && userProfile.AddressID != nil {
		logger.Info(constants.LogFetchAddress, "userID", user.KeycloakUserID)
		userService.populateAddress(ctx, response, *userProfile.AddressID)
	}

	logger.Info(constants.LogRetrieveUserSuccess, "userID", user.KeycloakUserID)
	return response, nil
}

// populateAddress fetches address data from the repository and populates the UserResponse object.
//
// Parameters:
//   - response: A pointer to the UserResponse object where the address data will be populated.
//   - addressID: The unique identifier of the address to fetch.
//
// Description:
//
//	This method retrieves the address data corresponding to the provided addressID from the user repository.
//	If the address is successfully fetched, it converts the AddressDB object to an Address object and assigns
//	it to the Profile.Address field of the UserResponse. If an error occurs during the fetch operation, a
//	warning is logged, and the method returns without modifying the response object.
func (userService *UserService) populateAddress(ctx context.Context, response *models.UserResponse, addressID string) {
	address, err := userService.userRepository.GetAddressByID(ctx, addressID)
	if err != nil {
		logger.Warn(constants.ErrFetchAddress, "error", err, "addressID", addressID)
		return
	}

	// Convert AddressDB to Address for the response
	response.Profile.Address = &models.Address{
		AddressLine1: address.AddressLine1,
		AddressLine2: address.AddressLine2,
		City:         address.City,
		State:        address.State,
		PinCode:      address.PinCode,
	}
}

// GetUsersByRole retrieves users by their role along with their profiles and associated data.
//
// Parameters:
//   - ctx: Context for managing request-scoped values.
//   - role: The role of the users to retrieve.
//   - limit: The maximum number of users to retrieve.
//   - offset: The starting point for pagination.
//
// Returns:
//   - A slice of UserResponse objects containing user details, profiles, and associated data.
//   - An error if the operation fails.
//
// Description:
//
//	This method fetches users based on their role from the user repository. For each user, it retrieves the
//	user profile, address (if available), and zone mappings. The retrieved data is used to populate a
//	UserResponse object for each user. If any operation fails, appropriate warnings or errors are logged,
//	and the method returns an error.
func (s *UserService) GetUsersByRole(ctx context.Context, role models.UserRole, limit, offset int) ([]*models.UserResponse, error) {
	logger.Info(constants.LogGetUsersByRoleStart, "role", role, "limit", limit, "offset", offset)

	// Get users by role
	users, err := s.userRepository.GetByRole(ctx, role, limit, offset)
	if err != nil {
		logger.Error(constants.ErrGetUsersByRole, "error", err, "role", role)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrGetUsersByRole, err))
	}

	var userResponses []*models.UserResponse
	for _, user := range users {

		keycloakUser, err := s.keycloakService.GetUserByID(user.KeycloakUserID)
		if err != nil {
			logger.Warn(constants.ErrFetchKeycloakUser, "error", err, "userID", user.KeycloakUserID)
		}

		if keycloakUser == nil || !keycloakUser.Enabled {
			logger.Warn("Skipping disabled user in Keycloak", "userID", user.KeycloakUserID)
			continue // Skip disabled users
		}

		// Get user profile
		userProfile, err := s.userRepository.GetUserProfileByUserID(ctx, user.KeycloakUserID)
		if err != nil {
			logger.Warn(constants.LogRetrieveUserProfileFailed, "error", err, "userID", user.KeycloakUserID)
			userProfile = nil // Continue without profile if not found
		}

		// Get address if profile has address ID
		var address *models.AddressDB
		if userProfile != nil && userProfile.AddressID != nil {
			address, _ = s.userRepository.GetAddressByID(ctx, *userProfile.AddressID)
		}

		// Create user response
		userResponse := &models.UserResponse{}
		userResponse.CreateUserResponse(user, userProfile)

		// Fetch and populate zone data
		zoneData, err := s.GetZoneMappingsByUserID(ctx, user.KeycloakUserID)
		if err != nil {
			logger.Warn(constants.LogFetchZoneMappingsFailed, "error", err, "userID", user.KeycloakUserID)
		} else {
			userResponse.ZoneData = zoneData
		}

		// Set address if available
		if address != nil {
			userResponse.Profile.Address = &models.Address{
				AddressLine1: address.AddressLine1,
				AddressLine2: address.AddressLine2,
				City:         address.City,
				State:        address.State,
				PinCode:      address.PinCode,
			}
		}

		userResponses = append(userResponses, userResponse)
	}

	logger.Info(constants.LogGetUsersByRoleSuccess, "role", role, "returnedCount", len(userResponses))
	return userResponses, nil
}

// DeleteUserByKeycloakID deletes a user from the system using their Keycloak user ID.
//
// Parameters:
//   - keycloakUserID: The unique identifier of the user in Keycloak.
//
// Returns:
//   - An error if the operation fails, or nil if the user is successfully deleted.
//
// Description:
//
//	This method validates the provided Keycloak user ID and attempts to delete the user from the repository.
//	If the deletion is successful, an informational log is recorded. If the operation fails, an error is logged
//	and returned to the caller.
func (s *UserService) DeleteUserByKeycloakID(keycloakUserID string) error {
	// Validate input
	if keycloakUserID == "" {
		return fmt.Errorf(constants.ErrKeycloakUserIDEmpty)
	}

	logger.Info(constants.ErrDeleteUser, "keycloakUserID", keycloakUserID)

	err := s.keycloakService.DeleteUser(keycloakUserID)
	if err != nil {
		logger.Error(constants.ErrDeleteUser, "error", err, "keycloakUserID", keycloakUserID)
		return fmt.Errorf("%s: %w", constants.ErrDeleteUser, err)
	}

	// Delete user using repository
	ctx := context.Background()
	err = s.userRepository.Delete(ctx, keycloakUserID)
	if err != nil {
		logger.Error("Failed to delete user", "error", err, "keycloakUserID", keycloakUserID)
		return err
	}

	logger.Info("User deleted successfully", "keycloakUserID", keycloakUserID)
	return nil
}

// UpdateUserComplete updates user and profile information, including their preferred language.
//
// Parameters:
//   - keycloakUserID: The unique identifier of the user in Keycloak.
//   - updateReq: A pointer to the UpdateUserRequest object containing the updated user details.
//
// Returns:
//   - A UserResponse object containing the updated user's details.
//   - An error if the operation fails.
//
// Description:
//
//	This method validates the provided Keycloak user ID and checks if the user exists. It updates the user's
//	basic information, including their preferred language, and their profile details in the repository. After
//	updating, it retrieves the updated user data and returns it. If any operation fails, an appropriate error
//	is logged and returned.
func (s *UserService) UpdateUserComplete(keycloakUserID string, updateReq *models.UpdateUserRequest) (*models.UserResponse, error) {
	// Validate input
	if keycloakUserID == "" {
		return nil, errors.NewServiceError(constants.ErrKeycloakUserIDEmpty)
	}

	// Check if user exists
	ctx := context.Background()
	_, err := s.userRepository.GetByKeycloakUserID(ctx, keycloakUserID)
	if err != nil {
		logger.Error(constants.ErrUserNotFound, "error", err, "keycloakUserID", keycloakUserID)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrUserNotFound, err))
	}

	logger.Info(constants.LogUpdateUserStart, "keycloakUserID", keycloakUserID, "email", updateReq.Email, "preferredLanguage", updateReq.PreferredLanguage)

	// Update user basic info (including preferred language)
	err = s.userRepository.UpdateUser(ctx, keycloakUserID, updateReq)
	if err != nil {
		logger.Error(constants.ErrUpdateUserFailed, "error", err, "keycloakUserID", keycloakUserID)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrUpdateUserFailed, err))
	}

	// Update user profile
	err = s.userRepository.UpdateUserProfileComplete(ctx, keycloakUserID, &updateReq.Profile)
	if err != nil {
		logger.Error(constants.ErrUpdateUserProfileFailed, "error", err, "keycloakUserID", keycloakUserID)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrUpdateUserProfileFailed, err))
	}

	// Get updated user data
	updatedUser, err := s.GetUser(ctx, keycloakUserID)
	if err != nil {
		logger.Error(constants.ErrGetUpdatedUserFailed, "error", err, "keycloakUserID", keycloakUserID)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrGetUpdatedUserFailed, err))
	}

	logger.Info(constants.LogUpdateUserSuccess, "keycloakUserID", keycloakUserID)
	return updatedUser, nil
}

// GetAllUsersWithFilters retrieves users based on optional filters and pagination parameters.
//
// Parameters:
//   - ctx: Context for managing request-scoped values.
//   - filters: A UserFilters object containing the filtering criteria.
//   - limit: The maximum number of users to retrieve.
//   - offset: The starting point for pagination.
//
// Returns:
//   - A UsersListResponse object containing the list of users and pagination details.
//   - An error if the operation fails.
//
// Description:
//
//	This method fetches users from the repository based on the provided filters and pagination parameters.
//	For each user, it retrieves the user profile, address (if available), and zone mappings. The retrieved
//	data is used to populate a UserResponse object for each user. If no users are found or an error occurs,
//	appropriate errors are logged and returned.
func (s *UserService) GetAllUsersWithFilters(ctx context.Context, filters models.UserFilters, limit, offset int) (*models.UsersListResponse, error) {
	logger.Info(constants.LogGetUsersWithFiltersStart, "limit", limit, "offset", offset)

	// Get users with filters from repository
	users, totalCount, err := s.userRepository.GetAllUsersWithFilters(ctx, filters, limit, offset)
	if err != nil {
		logger.Error(constants.ErrGetUsersWithFilters, "error", err)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrGetUsersWithFilters, err))
	}

	// Check if no users were found
	if len(users) == 0 {
		logger.Error(constants.ErrNoUsersFound)
		return nil, errors.NewServiceError(constants.ErrNoUsersFound)
	}

	// Convert to UserResponse format
	var userResponses []*models.UserResponse
	for _, user := range users {
		keycloakUser, err := s.keycloakService.GetUserByID(user.KeycloakUserID)
		if err != nil {
			logger.Warn(constants.ErrFetchKeycloakUser, "error", err, "userID", user.KeycloakUserID)
		}

		if keycloakUser == nil || !keycloakUser.Enabled {
			logger.Warn("Skipping disabled user in Keycloak", "userID", user.KeycloakUserID)
			continue // Skip disabled users
		}
		// Get user profile
		userProfile, err := s.userRepository.GetUserProfileByUserID(ctx, user.KeycloakUserID)
		if err != nil {
			logger.Warn(constants.LogRetrieveUserProfileFailed, "error", err, "userID", user.KeycloakUserID)
			userProfile = nil // Continue without profile if not found
		}

		// Create user response
		userResponse := &models.UserResponse{}
		userResponse.CreateUserResponse(user, userProfile)

		// Fetch and populate address if AddressID exists
		if userProfile != nil && userProfile.AddressID != nil {
			s.populateAddress(ctx, userResponse, *userProfile.AddressID)
		}

		// Fetch and populate zone data
		if zoneData, err := s.GetZoneMappingsByUserID(ctx, user.KeycloakUserID); err != nil {
			logger.Warn(constants.LogFetchZoneMappingsFailed, "error", err, "userID", user.KeycloakUserID)
		} else {
			userResponse.ZoneData = zoneData
		}

		userResponses = append(userResponses, userResponse)
	}

	response := &models.UsersListResponse{
		Users:      userResponses,
		TotalCount: int(totalCount),
		Limit:      limit,
		Offset:     offset,
	}

	logger.Info(constants.LogUsersRetrieved, "totalCount", totalCount, "returnedCount", len(userResponses))
	return response, nil
}

// InsertZoneMappings inserts zone mappings for a user into the repository.
//
// Parameters:
//   - ctx: Context for managing request-scoped values.
//   - userID: The unique identifier of the user for whom the zone mappings are being inserted.
//   - zoneData: A slice of ZoneMapping objects containing the zone and ward details to be inserted.
//
// Returns:
//   - An error if the operation fails, or nil if the zone mappings are successfully inserted.
//
// Description:
//
//	This method iterates over the provided zoneData slice and creates a ZoneMapping object for each entry.
//	It then inserts the ZoneMapping into the repository. If any insertion fails, an error is returned
//	immediately. If all insertions succeed, the method returns nil.
func (s *UserService) InsertZoneMappings(ctx context.Context, userID string, zoneData []models.ZoneMapping) error {
	for _, zone := range zoneData {
		mapping := models.ZoneMapping{
			UserID: userID,
			Zone:   zone.Zone,
			Wards:  pq.StringArray(zone.Wards),
		}
		if err := s.zoneMappingRepository.CreateZoneMapping(ctx, &mapping); err != nil {
			return fmt.Errorf("failed to insert zone mapping for user %s, zone %s: %w", userID, zone.Zone, err)
		}
	}
	return nil
}

// ValidateZoneAndWards validates the provided zone and wards against the MDMS data.
//
// Parameters:
//   - zone: The zone to validate.
//   - wards: A slice of ward names to validate within the zone.
//
// Returns:
//   - A slice of allowed wards if the validation is successful.
//   - An error if the validation fails.
//
// Description:
// This method fetches zone details from the MDMS service and validates the provided zone and wards.
// If the zone is invalid or any of the wards are not allowed within the zone, an error is returned.
// The method logs the validation process, including any errors encountered.
func (s *UserService) ValidateZoneAndWards(zone string, wards []string) ([]string, error) {
	logger.Info(constants.LogZoneValidationStart, "zone", zone, "wards", wards)

	mdmsResponse, err := utils.GetZoneDetailsFromMDMS(zone)
	if err != nil {
		logger.Error(constants.ErrFetchZoneDetailsMDMS, "error", err, "zone", zone)
		if strings.Contains(err.Error(), "status: 400") {
			return nil, errors.NewServiceError(fmt.Sprintf("%s: %s", constants.ErrInvalidZone, zone))
		}
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrFetchZoneDetailsMDMS, err))
	}

	if len(mdmsResponse.MDMS) == 0 || mdmsResponse.MDMS[0].Data.Zone != zone {
		logger.Error(constants.ErrZoneNotFound, "zone", zone)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %s", constants.ErrZoneNotFound, zone))
	}

	allowedWards := mdmsResponse.MDMS[0].Data.Wards
	for _, ward := range wards {
		if !contains(allowedWards, ward) {
			logger.Error(constants.ErrWardNotAllowed, "ward", ward, "zone", zone, "allowedWards", allowedWards)
			return nil, errors.NewServiceError(fmt.Sprintf("%s: %s. Allowed: %v", constants.ErrWardNotAllowed, ward, allowedWards))
		}
	}

	logger.Info(constants.LogZoneValidationSuccess, "zone", zone, "wards", wards)
	return allowedWards, nil
}

// GetZoneMappingsByUserID retrieves zone mappings for a user.
//
// Parameters:
//   - ctx: Context for managing request-scoped values.
//   - userID: The unique identifier of the user whose zone mappings are to be retrieved.
//
// Returns:
//   - A slice of ZoneData objects containing the zone and ward details.
//   - An error if the operation fails.
//
// Description:
// This method fetches zone mappings for the specified user from the repository. It converts the retrieved
// ZoneMapping objects into ZoneData objects, which include the zone number and a slice of ward names.
// If an error occurs during the fetch operation, it is logged and returned.
func (s *UserService) GetZoneMappingsByUserID(ctx context.Context, userID string) ([]models.ZoneData, error) {
	zoneMappings, err := s.zoneMappingRepository.GetZoneMappingsByUser(ctx, userID)
	if err != nil {
		logger.Error(constants.ErrFetchZoneMappings, "error", err, "userID", userID)
		return nil, errors.NewServiceError(fmt.Sprintf("%s: %v", constants.ErrFetchZoneMappings, err))
	}

	// Convert ZoneMapping to ZoneData
	zoneData := make([]models.ZoneData, len(zoneMappings))
	for i, mapping := range zoneMappings {
		zoneData[i] = models.ZoneData{
			ZoneNumber: mapping.Zone,
			Wards:      []string(mapping.Wards), // Convert pq.StringArray to []string
		}
	}

	return zoneData, nil
}

// contains checks if a slice contains a specific item.
//
// Parameters:
//   - slice: The slice of strings to search within.
//   - item: The string item to search for.
//
// Returns:
//   - A boolean indicating whether the item is found in the slice.
func contains(slice []string, item string) bool {
	for _, v := range slice {
		if v == item {
			return true
		}
	}
	return false
}

// GetUserCounts retrieves counts for total users, active users, and field agents.
func (s *UserService) GetUserCounts(ctx context.Context) (map[string]int64, error) {
	logger.Info("Getting user counts")

	totalUsers, activeUsers, fieldAgents, err := s.userRepository.GetUserCounts(ctx)
	if err != nil {
		logger.Error("Failed to get user counts", "error", err)
		return nil, err
	}

	counts := map[string]int64{
		"totalUsers":  totalUsers,
		"activeUsers": activeUsers,
		"fieldAgents": fieldAgents,
	}

	logger.Info("User counts retrieved successfully", "counts", counts)
	return counts, nil
}
