// Package constants defines error and status message constants for the onboarding service.
// This file centralizes all error, success, and service info messages for maintainability.
package constants

// Keycloak service error messages
const (
	ErrEmptyUserID        = "userID cannot be empty"
	ErrEmptyRoleName      = "roleName cannot be empty"
	ErrEmptyUsername      = "username cannot be empty"
	ErrEmptyEmail         = "email cannot be empty"
	ErrCreateToken        = "failed to create token request"
	ErrRequestToken       = "failed to request token"
	ErrDecodeToken        = "failed to decode token response"
	ErrGetAdminToken      = "failed to get admin token"
	ErrMarshalUserData    = "failed to marshal user data"
	ErrCreateUserRequest  = "failed to create user request"
	ErrCreateUser         = "failed to create user"
	ErrNoLocationHeader   = "no location header in create user response"
	ErrInvalidLocation    = "invalid location header format"
	ErrGetRole            = "failed to get role"
	ErrMarshalRole        = "failed to marshal role mapping"
	ErrAssignRoleRequest  = "failed to create role assignment request"
	ErrAssignRole         = "failed to assign role"
	ErrGetUserRoles       = "failed to get user roles"
	ErrDeleteUserRequest  = "failed to create delete request"
	ErrDeleteUser         = "failed to delete user"
	ErrDeleteUserKeycloak = "failed to delete user from Keycloak"
	ErrCreateRoleRequest  = "failed to create role request"
	ErrKeycloakAPIStatus  = "keycloak API returned status"
	ErrDecodeKeycloakUser = "failed to decode Keycloak user response"
)

// User service error messages
const (
	ErrValidationFailed          = "validation failed"
	ErrCreateKeycloakUser        = "failed to create user in Keycloak"
	ErrAssignRoleToUser          = "failed to assign role to user"
	ErrBeginTransaction          = "failed to begin database transaction"
	ErrCreateUserFromRequest     = "failed to create user from request"
	ErrSaveUserToDatabase        = "failed to save user to database"
	ErrSaveUserProfile           = "failed to save user profile to database"
	ErrZoneValidationFailed      = "zone validation failed"
	ErrInsertZoneMappings        = "failed to insert zone mappings"
	ErrFetchZoneMappings         = "failed to fetch zone mappings"
	ErrFetchAddress              = "failed to fetch address"
	ErrUserNotFound              = "user not found"
	ErrUpdateUser                = "failed to update user"
	ErrGetUsersByRole            = "failed to get users by role"
	ErrGetUsersWithFilters       = "failed to get users with filters"
	ErrNoUsersFound              = "no users found matching the specified filters"
	ErrInvalidZone               = "invalid zone"
	ErrZoneNotFound              = "zone not found in MDMS"
	ErrWardNotAllowed            = "ward not allowed for zone"
	ErrUserRepositoryUnavailable = "unified user repository not available"
	ErrKeycloakUserIDEmpty       = "keycloak user ID cannot be empty"
	ErrUpdateUserFailed          = "failed to update user"
	ErrGetUpdatedUserFailed      = "failed to get updated user"
	ErrFetchZoneDetailsMDMS      = "failed to fetch zone details from MDMS"
	ErrFetchKeycloakUser         = "failed to fetch user from Keycloak"
)

// Repository-specific error messages (user_repo.go)
const (
	ErrUserProfileNotFound            = "user profile not found"
	ErrRetrieveUserProfileFailed      = "failed to retrieve user profile"
	ErrRetrieveUserFailed             = "failed to retrieve user"
	ErrCheckUserExistenceFailed       = "Failed to check user existence"
	ErrDeleteAddressFailed            = "Failed to delete address"
	ErrDeleteUserProfileFailed        = "Failed to delete user profile"
	ErrDeleteUserFailed               = "Failed to delete user"
	ErrDeleteTransactionFailed        = "Failed to complete delete transaction"
	ErrAddressNotFound                = "Address not found"
	ErrRetrieveAddressFailed          = "Failed to retrieve address"
	ErrCountUsersFailed               = "Failed to count users"
	ErrRetrieveAddressIDFailed        = "Failed to retrieve AddressID"
	ErrCreateNewAddressFailed         = "Failed to create new address"
	ErrUpdateAddressIDFailed          = "Failed to update AddressID"
	ErrUpdateExistingAddressFailed    = "Failed to update existing address"
	ErrUpdateUserProfileFailed        = "Failed to update user profile"
	ErrCountUsersWithFiltersFailed    = "Failed to count users with filters"
	ErrRetrieveUsersWithFiltersFailed = "Failed to retrieve users with filters"
	ErrCheckAdhaarExistsFailed        = "Failed to check Aadhaar existence"
	ErrCheckPhoneExistsFailed         = "Failed to check phone number existence"
	ErrDeleteZoneMappingFailed        = "Failed to soft delete zone mappings"
	ErrGetUsersToDisableFailed        = "Failed to get users to disable"
	ErrGetUsersToEnableFailed         = "Failed to get users to enable"
)

// Transaction-related error messages (transaction.go)
const (
	ErrCreateUserInTransaction        = "Failed to create user in transaction"
	ErrCreateUserProfileInTransaction = "Failed to create user profile in transaction"
	ErrRollbackTransaction            = "Failed to rollback transaction"
	ErrCommitTransaction              = "Failed to commit transaction"
)

// MDMS utility error messages
const (
	ErrCreateMDMSRequest   = "Failed to create MDMS request"
	ErrCallMDMSAPI         = "Failed to call MDMS API"
	ErrMDMSAPINon200Status = "MDMS API returned non-200 status"
	ErrDecodeMDMSResponse  = "Failed to decode MDMS response"
)

// Validation-related error messages
const (
	ErrInvalidUsername                = "username must be at least 3 characters long"
	ErrInvalidEmail                   = "invalid email format"
	ErrInvalidFirstName               = "first name must be at least 2 characters long"
	ErrInvalidPassword                = "password must be at least 4 characters long"
	ErrInvalidPhoneNumber             = "phone number must be exactly 10 digits long"
	ErrInvalidFullName                = "full name must be at least 2 characters long"
	ErrInvalidAdhaarNumber            = "adhaar number must be a positive number with exactly 12 digits"
	ErrInvalidGender                  = "gender is required"
	ErrInvalidRelationship            = "relationship to property is required"
	ErrInvalidOwnershipShare          = "ownership share must be between 0 and 100"
	ErrUnsupportedRole                = "supported roles are CITIZEN, AGENT, SERVICE_MANAGER, COMMISSIONER"
	ErrDuplicateAdhaarNumber          = "aadhaar number already exists"
	ErrDuplicatePhoneNumber           = "phone number already exists"
	ErrCheckAdhaarNumberFailed        = "failed to check Aadhaar number"
	ErrCheckPhoneNumberFailed         = "failed to check phone number"
	ErrInvalidDateRange               = "end_date must be greater than or equal to start_date"
	ErrStartDateInPast                = "start_date cannot be in the past"
	ErrPasswordRequiredForNonCitizens = "password is required for non-CITIZEN roles"
)

// HTTP error messages for API responses
const (
	// Validation Errors
	ErrMsgInvalidRequestPayload = "Invalid request payload"
	ErrMsgInvalidRequestBody    = "Invalid request body"
	ErrMsgInvalidRole           = "Invalid role"
	ErrMsgInvalidRoleDetail     = "Role must be one of: AGENT, CITIZEN, COMMISSIONER, SERVICE_MANAGER"
	ErrMsgInvalidIsActive       = "Invalid isActive parameter"
	ErrMsgInvalidIsActiveDetail = "isActive must be true or false"
	ErrMsgInvalidPhoneNumber    = "Invalid phone number"
	ErrMsgInvalidPhoneDetail    = "Phone number must be exactly 10 digits"
	ErrMsgMissingUserID         = "User ID is required"
	ErrMsgMissingUserIDDetail   = "Missing user identifier"

	// Operation Errors
	ErrMsgFailedToCreateUser = "Failed to create user"
	ErrMsgFailedToGetUser    = "Failed to get user"
	ErrMsgFailedToGetUsers   = "Failed to get users"
	ErrMsgFailedToUpdateUser = "Failed to update user"
	ErrMsgFailedToDeleteUser = "Failed to delete user"
	ErrMsgUserNotFound       = "User not found"
	ErrMsgNoUsersFound       = "No users found"
)

// Success messages for API responses
const (
	SuccessMsgServiceHealthy = "Service is healthy"
	SuccessMsgUserCreated    = "User created successfully"
	SuccessMsgUserRetrieved  = "User retrieved successfully"
	SuccessMsgUsersRetrieved = "Users retrieved successfully"
	SuccessMsgUserUpdated    = "User updated successfully"
	SuccessMsgUserDeleted    = "User deleted successfully"
)

// Service information constants
const (
	ServiceName    = "property-tax-onboarding"
	ServiceVersion = "1.0.0"
	ServiceStatus  = "healthy"
)

// Pagination-related constants
const (
	DefaultPageLimit = 10
	MaxPageLimit     = 100
	DefaultOffset    = 0
	PhoneNumberLen   = 10
)
