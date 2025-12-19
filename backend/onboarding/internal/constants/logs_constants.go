// Package constants defines log message constants for the onboarding service.
// This file centralizes all log messages for maintainability and consistency.
package constants

// Log messages for UserService operations
const (
	LogCreateUserStart          = "Creating new user"
	LogCreateUserKeycloak       = "Creating user in Keycloak"
	LogAssignRoleToUser         = "Assigning role to user in Keycloak"
	LogBeginTransaction         = "Starting database transaction"
	LogSaveUserToDatabase       = "Saving user to database"
	LogSaveUserProfile          = "Saving user profile to database"
	LogCommitTransaction        = "Committing database transaction"
	LogRollbackKeycloakUser     = "Rolling back Keycloak user creation"
	LogZoneValidationStart      = "Validating zone and wards"
	LogInsertZoneMappings       = "Inserting zone mappings"
	LogFetchZoneMappings        = "Fetching zone mappings for response"
	LogFetchAddress             = "Fetching address for user profile"
	LogUserCreatedSuccessfully  = "User created successfully"
	LogUserDeletedSuccessfully  = "User deleted successfully"
	LogUpdateUserStart          = "Updating user"
	LogUpdateUserSuccess        = "User updated successfully"
	LogGetUsersWithFiltersStart = "Getting users with filters"
	LogUsersRetrieved           = "Users retrieved successfully"
	LogZoneValidationSuccess    = "Zone and wards validated successfully"
	LogGetUsersByRoleSuccess    = "Successfully retrieved users by role"
	LogGetUsersByRoleStart      = "Getting users by role"

	// New log messages for GetUser
	LogRetrieveUserStart            = "Retrieving user"
	LogRetrieveUserByUsernameFailed = "Failed to retrieve user by username"
	LogRetrieveUserProfileFailed    = "Failed to retrieve user profile"
	LogRetrieveUserRolesFailed      = "Failed to retrieve user roles"
	LogFetchZoneMappingsFailed      = "Failed to fetch zone mappings"
	LogRetrieveUserSuccess          = "Successfully retrieved user"
)

// Log messages for UserRepository operations
// Log messages for Aadhaar and phone checks
const (
	LogRetrieveUserProfileStart        = "Starting retrieval of user profile"
	LogRetrieveUserProfileSuccess      = "Successfully retrieved user profile"
	LogDeleteUserStart                 = "Starting deletion of user and related data"
	LogNoUserProfileFound              = "No user profile found, skipping profile and address deletion"
	LogDeleteAddressStart              = "Starting deletion of address"
	LogDeleteAddressSuccess            = "Successfully deleted address"
	LogNoAddressAssociated             = "No address associated with user profile, skipping address deletion"
	LogDeleteUserProfileSuccess        = "Successfully deleted user profile"
	LogDeleteUserSuccess               = "Successfully deleted user"
	LogDeleteUserAndDataSuccess        = "Successfully deleted user and all related data"
	LogRetrieveAddressStart            = "Starting retrieval of address"
	LogRetrieveAddressSuccess          = "Successfully retrieved address"
	LogCountUsersStart                 = "Starting count of users"
	LogCountUsersSuccess               = "Successfully counted users"
	LogUpdateUserStartt                = "Starting update of user"
	LogUpdateUserProfileStart          = "Starting update of user profile"
	LogCreateNewAddressStart           = "Starting creation of new address"
	LogCreateNewAddressSuccess         = "Successfully created new address"
	LogUpdateExistingAddressStart      = "Starting update of existing address"
	LogUpdateExistingAddressSuccess    = "Successfully updated existing address"
	LogUpdateUserProfileSuccess        = "Successfully updated user profile"
	LogGetUsersWithFiltersStartRetrive = "Starting retrieval of users with filters"
	LogGetUsersWithFiltersSuccess      = "Successfully retrieved users with filters"
	LogDeleteZoneMappingSuccess        = "Successfully deleted zone mappings"
	LogUserAlreadyDeleted              = "User is already deleted"
	LogSoftDeleteUserStart             = "Starting soft delete of user"
	ErrSoftDeleteUserFailed            = "Failed to soft delete user"
	LogSoftDeleteUserSuccess           = "Successfully soft deleted user"
)

// Log messages for transaction operations
const (
	LogCheckAdhaarExistsStart   = "Starting check for Aadhaar existence"
	LogCheckAdhaarExistsSuccess = "Successfully checked Aadhaar existence"
	LogCheckPhoneExistsStart    = "Starting check for phone number existence"
	LogCheckPhoneExistsSuccess  = "Successfully checked phone number existence"
)

const (
	LogCreateUserInTransaction         = "Creating user in transaction"
	LogUserCreatedInTransaction        = "User created successfully in transaction"
	LogCreateUserProfileInTransaction  = "Creating user profile in transaction"
	LogUserProfileCreatedInTransaction = "User profile created successfully in transaction"
	LogTransactionCommitted            = "Transaction committed successfully"
	LogRollbackTransaction             = "Rolling back transaction"
	LogTransactionRolledBack           = "Transaction rolled back successfully"
)

// Log messages for API requests received
const (
	LogHealthCheckRequested  = "health check requested"
	LogCreateUserRequest     = "create user request received"
	LogGetUserRequest        = "get user request received"
	LogGetUsersByRoleRequest = "get users by role request received"
	LogGetAllUsersRequest    = "get all users request received"
	LogUpdateUserRequest     = "update user request received"
	LogDeleteUserRequest     = "delete user request received"
)

// Log messages for successful API operations
const (
	LogUserCreatedSuccess    = "user created successfully"
	LogUserRetrievedSuccess  = "user retrieved successfully"
	LogUsersRetrievedSuccess = "users retrieved successfully"
	LogUserUpdatedSuccess    = "user updated successfully"
	LogUserDeletedSuccess    = "user deleted successfully"
)

// Log messages for API errors
const (
	LogInvalidRequestPayload   = "invalid request payload"
	LogInvalidRequestBody      = "invalid request body"
	LogFailedToCreateUser      = "failed to create user"
	LogFailedToGetUser         = "failed to get user"
	LogFailedToGetUsersByRole  = "failed to get users by role"
	LogFailedToGetUsersFilters = "failed to get users with filters"
	LogFailedToUpdateUser      = "failed to update user"
	LogFailedToDeleteUser      = "failed to delete user"
)

// Log messages for debug and info events
const (
	LogRawRoleParameter     = "raw role parameter from URL"
	LogUpdateRequestDetails = "update request details"
	LogParsedFilters        = "parsed filters"
)
