package errors

import "fmt"

// ServiceError represents a generic error for all layers of the application.
type ServiceError struct {
	Message string // The error message.
}

// Error implements the error interface.
func (e *ServiceError) Error() string {
	return e.Message
}

// NewServiceError creates a new ServiceError.
func NewServiceError(message string) *ServiceError {
	return &ServiceError{
		Message: message,
	}
}

// NewUserServiceError creates a new error specific to the UserService.
func NewUserServiceError(message string) *ServiceError {
	return NewServiceError(fmt.Sprintf("UserService: %s", message))
}

// NewKeycloakServiceError creates a new error specific to the KeycloakService.
func NewKeycloakServiceError(message string) *ServiceError {
	return NewServiceError(fmt.Sprintf("KeycloakService: %s", message))
}

// NewRepositoryError creates a new error specific to the Repository layer.
func NewRepositoryError(message string) *ServiceError {
	return NewServiceError(fmt.Sprintf("Repository: %s", message))
}

// NewUtilityError creates a new error specific to the Utility layer.
func NewUtilityError(message string) *ServiceError {
	return NewServiceError(fmt.Sprintf("Utility: %s", message))
}
