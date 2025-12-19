// Package validator provides validation logic for user-related API requests.
// This file implements validation for user creation, including uniqueness checks and field validation.
package validator

import (
	"fmt"
	"property-tax-onboarding/internal/constants"
	"property-tax-onboarding/internal/errors"
	"property-tax-onboarding/internal/models"
	"property-tax-onboarding/internal/repositories"
	"property-tax-onboarding/pkg/logger"
	"regexp"
	"strconv"
	"strings"
	"time"
	"gorm.io/gorm"
)

// UserValidationService provides validation logic for user creation and update requests.
// Integrates with the user repository and DB to check for uniqueness and data integrity.
type UserValidationService struct {
	userRepository repositories.UserRepository // Used for repository-based checks
	db             *gorm.DB                    // GORM DB instance for direct queries
}

// NewUserValidationService creates and returns a new UserValidationService instance.
// Injects the user repository and GORM DB for duplicate checks.
func NewUserValidationService(userRepo repositories.UserRepository, db *gorm.DB) *UserValidationService {
	return &UserValidationService{
		userRepository: userRepo,
		db:             db,
	}
}

// ValidateCreateUserRequest validates the CreateUserRequest payload for user creation.
// Checks for required fields, format, and uniqueness of Aadhaar and phone number.
// Returns an error if validation fails, or nil if valid.
func (v *UserValidationService) ValidateCreateUserRequest(req *models.CreateUserRequest) error {
	// Basic validation for all users
	if len(strings.TrimSpace(req.Username)) < 3 {
		return fmt.Errorf(constants.ErrInvalidUsername)
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(req.Email) {
		return fmt.Errorf(constants.ErrInvalidEmail)
	}

	if len(strings.TrimSpace(req.Profile.FirstName)) < 2 {
		return fmt.Errorf(constants.ErrInvalidFirstName)
	}

	if req.Role != models.RoleCitizen {
		if req.Password == "" {
			return fmt.Errorf(constants.ErrPasswordRequiredForNonCitizens)
		}
		if len(req.Password) < 4 {
			return fmt.Errorf(constants.ErrInvalidPassword)
		}
	}

	if len(strings.TrimSpace(req.Profile.PhoneNumber)) != 10 {
		return fmt.Errorf(constants.ErrInvalidPhoneNumber)
	}

	// Validate additional profile fields
	if len(strings.TrimSpace(req.Profile.FullName)) < 2 {
		return fmt.Errorf(constants.ErrInvalidFullName)
	}

	// Aadhaar validation - ONLY validate if provided and not nil
	if req.Profile.AdhaarNo != nil && *req.Profile.AdhaarNo > 0 {
		adhaarStr := strconv.FormatInt(*req.Profile.AdhaarNo, 10)
		if len(adhaarStr) != 12 {
			return fmt.Errorf("adhaar number must be exactly 12 digits")
		}

		// Check for duplicate Aadhaar
		exists, err := v.CheckAdhaarExists(*req.Profile.AdhaarNo)
		if err != nil {
			return fmt.Errorf("%s: %w", constants.ErrCheckAdhaarNumberFailed, err)
		}
		if exists {
			return fmt.Errorf(constants.ErrDuplicateAdhaarNumber)
		}
	}

	if req.Profile.OwnershipShare < 0 || req.Profile.OwnershipShare > 100 {
		return fmt.Errorf(constants.ErrInvalidOwnershipShare)
	}

	// Validate role using switch for better readability
	switch req.Role {
	case models.RoleAgent, models.RoleCitizen, models.RoleServiceManager, models.RoleCommissioner, models.RoleAdmin:
		// Valid role
	default:
		return fmt.Errorf(constants.ErrUnsupportedRole)
	}

	// Check for duplicate phone number
	exists, err := v.CheckPhoneExists(req.Profile.PhoneNumber)
	if err != nil {
		return fmt.Errorf("%s: %w", constants.ErrCheckPhoneNumberFailed, err)
	}
	if exists {
		return fmt.Errorf(constants.ErrDuplicatePhoneNumber)
	}

	if req.StartDate != nil && req.EndDate != nil {
		if req.EndDate.Before(*req.StartDate) {
			return fmt.Errorf(constants.ErrInvalidDateRange)
		}
		if req.StartDate.Before(time.Now()) {
			return fmt.Errorf(constants.ErrStartDateInPast)
		}
	}

	return nil
}

// CheckAdhaarExists checks if an Aadhaar number already exists in the user profiles table.
// Returns true if the Aadhaar exists, or false otherwise. Logs and wraps errors for traceability.
func (v *UserValidationService) CheckAdhaarExists(adhaarNo int64) (bool, error) {
	logger.Info(constants.LogCheckAdhaarExistsStart, "adhaarNo", adhaarNo)

	var count int64
	if err := v.db.Model(&models.UserProfile{}).Where("adhaar_no = ?", adhaarNo).Count(&count).Error; err != nil {
		logger.Error(constants.ErrCheckAdhaarExistsFailed, "error", err, "adhaarNo", adhaarNo)
		return false, errors.NewRepositoryError(fmt.Sprintf("%s: %v", constants.ErrCheckAdhaarExistsFailed, err))
	}

	exists := count > 0
	logger.Info(constants.LogCheckAdhaarExistsSuccess, "adhaarNo", adhaarNo, "exists", exists)
	return exists, nil
}

// CheckPhoneExists checks if a phone number already exists in the user profiles table.
// Returns true if the phone number exists, or false otherwise. Logs and wraps errors for traceability.
func (v *UserValidationService) CheckPhoneExists(phoneNumber string) (bool, error) {
	logger.Info(constants.LogCheckPhoneExistsStart, "phoneNumber", phoneNumber)

	var count int64
	if err := v.db.Model(&models.UserProfile{}).Where("phone_number = ?", phoneNumber).Count(&count).Error; err != nil {
		logger.Error(constants.ErrCheckPhoneExistsFailed, "error", err, "phoneNumber", phoneNumber)
		return false, errors.NewRepositoryError(fmt.Sprintf("%s: %v", constants.ErrCheckPhoneExistsFailed, err))
	}

	exists := count > 0
	logger.Info(constants.LogCheckPhoneExistsSuccess, "phoneNumber", phoneNumber, "exists", exists)
	return exists, nil
}
