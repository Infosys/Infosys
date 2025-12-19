package repositories

import (
	"context"
	"fmt"
	"property-tax-onboarding/internal/constants"
	"property-tax-onboarding/internal/models"
	"property-tax-onboarding/pkg/logger"
	"gorm.io/gorm"
)

// Transaction interface for repository operations
//
// Description:
// This interface defines the methods required for transactional operations
// in the repository layer, such as creating users and user profiles, and
// managing transaction commits and rollbacks.
type Transaction interface {
	Create(user *models.User) error
	CreateUserProfile(profile *models.UserProfile) error
	Commit() error
	Rollback() error
}

// PostgreSQLTransaction implements Transaction interface
//
// Description:
// This struct provides an implementation of the Transaction interface
// using PostgreSQL and GORM for database operations.
type PostgreSQLTransaction struct {
	tx *gorm.DB
}

// Create inserts a new user within a transaction.
//
// Parameters:
//   - user: A pointer to the User object to be created.
//
// Returns:
//   - An error if the operation fails.
func (t *PostgreSQLTransaction) Create(user *models.User) error {
	logger.Info(constants.LogCreateUserInTransaction, "keycloak_user_id", user.KeycloakUserID)

	if err := t.tx.Create(user).Error; err != nil {
		logger.Error(constants.ErrCreateUserInTransaction, "error", err)
		return fmt.Errorf("%s: %w", constants.ErrCreateUserInTransaction, err)
	}

	logger.Info(constants.LogUserCreatedInTransaction, "keycloak_user_id", user.KeycloakUserID)
	return nil
}

// CreateUserProfile inserts a new user profile within a transaction.
//
// Parameters:
//   - profile: A pointer to the UserProfile object to be created.
//
// Returns:
//   - An error if the operation fails.
func (t *PostgreSQLTransaction) CreateUserProfile(profile *models.UserProfile) error {
	logger.Info(constants.LogCreateUserProfileInTransaction, "profileID", profile.ID)

	if err := t.tx.Create(profile).Error; err != nil {
		logger.Error(constants.ErrCreateUserProfileInTransaction, "error", err, "profileID", profile.ID)
		return fmt.Errorf("%s: %w", constants.ErrCreateUserProfileInTransaction, err)
	}

	logger.Info(constants.LogUserProfileCreatedInTransaction, "profileID", profile.ID)
	return nil
}

// Commit commits the transaction.
//
// Returns:
//   - An error if the operation fails.
func (t *PostgreSQLTransaction) Commit() error {
	logger.Info(constants.LogCommitTransaction)

	if err := t.tx.Commit().Error; err != nil {
		logger.Error(constants.ErrCommitTransaction, "error", err)
		return fmt.Errorf("%s: %w", constants.ErrCommitTransaction, err)
	}

	logger.Info(constants.LogTransactionCommitted)
	return nil
}

// Rollback rolls back the transaction.
//
// Returns:
//   - An error if the operation fails.
func (t *PostgreSQLTransaction) Rollback() error {
	logger.Info(constants.LogRollbackTransaction)

	if err := t.tx.Rollback().Error; err != nil {
		logger.Error(constants.ErrRollbackTransaction, "error", err)
		return fmt.Errorf("%s: %w", constants.ErrRollbackTransaction, err)
	}

	logger.Info(constants.LogTransactionRolledBack)
	return nil
}

// BeginTransaction starts a new database transaction.
//
// Returns:
//   - A Transaction object for managing the transaction.
//   - An error if the transaction could not be started.
func (r *PostgreSQLUserRepository) BeginTransaction(ctx context.Context) (Transaction, error) {
	logger.Info(constants.LogBeginTransaction)

	tx := r.dbd.WithContext(ctx).Begin()
	if tx.Error != nil {
		logger.Error(constants.ErrBeginTransaction, "error", tx.Error)
		return nil, fmt.Errorf("%s: %w", constants.ErrBeginTransaction, tx.Error)
	}

	return &PostgreSQLTransaction{tx: tx}, nil
}
