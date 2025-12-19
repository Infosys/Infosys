package repositories

import (
	"context"
	"property-tax-onboarding/internal/models"
)

// UserRepository defines the interface for unified user database operations
type UserRepository interface {
	GetByKeycloakUserID(ctx context.Context, keycloakUserID string) (*models.User, error)
	GetByRole(ctx context.Context, role models.UserRole, limit, offset int) ([]*models.User, error)
	Delete(ctx context.Context, keycloakUserID string) error
	Count() (int64, error)
	GetUserCounts(ctx context.Context) (int64, int64, int64, error)

	// UserProfile operations
	GetUserProfileByUserID(ctx context.Context,userID string) (*models.UserProfile, error)

	// Address operations
	GetAddressByID(ctx context.Context, addressID string) (*models.AddressDB, error)

	// Update operations
	UpdateUser(ctx context.Context, keycloakUserID string, updateReq *models.UpdateUserRequest) error
	UpdateUserProfileComplete(ctx context.Context, keycloakUserID string, profile *models.UpdateUserProfile) error

	// Get all users with filters
	GetAllUsersWithFilters(ctx context.Context,filters models.UserFilters, limit, offset int) ([]*models.User, int64, error)

	// Transaction management
	BeginTransaction(ctx context.Context) (Transaction, error)
	UpdateUserIsActive(ctx context.Context, userID string, isActive bool) error

	// New methods for scheduler
	GetUsersByStartDate(ctx context.Context, date string) ([]models.User, error)
	GetUsersByEndDate(ctx context.Context, date string) ([]models.User, error)
	GetUsersWithFutureStartDate(ctx context.Context, currentDate string) ([]models.User, error)
}
