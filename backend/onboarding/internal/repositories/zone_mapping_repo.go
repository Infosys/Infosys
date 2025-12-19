package repositories

import (
    "context"
    "fmt"
    "property-tax-onboarding/internal/models"
    "property-tax-onboarding/pkg/logger"
    "gorm.io/gorm"
)

// ZoneMappingRepository defines the interface for zone mapping database operations
type ZoneMappingRepository interface {
    CreateZoneMapping(ctx context.Context, mapping *models.ZoneMapping) error
    GetZoneMappingsByUser(ctx context.Context, userID string) ([]models.ZoneMapping, error)
}

// PostgreSQLZoneMappingRepository handles operations related to zone mappings
type PostgreSQLZoneMappingRepository struct {
    db *gorm.DB
}

// NewPostgreSQLZoneMappingRepository creates a new instance of PostgreSQLZoneMappingRepository
func NewPostgreSQLZoneMappingRepository(db *gorm.DB) *PostgreSQLZoneMappingRepository {
    return &PostgreSQLZoneMappingRepository{db: db}
}

// CreateZoneMapping inserts a new zone mapping for a user
func (r *PostgreSQLZoneMappingRepository) CreateZoneMapping(ctx context.Context, mapping *models.ZoneMapping) error {
    logger.Info("Creating zone mapping", "user_id", mapping.UserID, "zone", mapping.Zone)

    if err := r.db.WithContext(ctx).Create(mapping).Error; err != nil {
        logger.Error("Failed to create zone mapping", "error", err, "user_id", mapping.UserID, "zone", mapping.Zone)
        return fmt.Errorf("failed to create zone mapping: %w", err)
    }

    logger.Info("Zone mapping created successfully", "user_id", mapping.UserID, "zone", mapping.Zone)
    return nil
}

// GetZoneMappingsByUser retrieves zone mappings for a specific user
func (r *PostgreSQLZoneMappingRepository) GetZoneMappingsByUser(ctx context.Context, userID string) ([]models.ZoneMapping, error) {
    logger.Info("Fetching zone mappings for user", "user_id", userID)

    var mappings []models.ZoneMapping
    if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&mappings).Error; err != nil {
        logger.Error("Failed to fetch zone mappings for user", "error", err, "user_id", userID)
        return nil, fmt.Errorf("failed to fetch zone mappings: %w", err)
    }

    logger.Info("Zone mappings fetched successfully", "user_id", userID)
    return mappings, nil
}

