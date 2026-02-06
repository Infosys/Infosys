package repositories

import (
	"context"
	"enumeration/internal/constants"
	"enumeration/internal/models"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	preloadConstructionDetailsFloorDetails = "ConstructionDetails.FloorDetails"
)

type propertyRepository struct {
	db *gorm.DB
}

func NewPropertyRepository(db *gorm.DB) PropertyRepository {
	return &propertyRepository{db: db}
}

// Create - STEP 10: Save to database with tenant_id
func (r *propertyRepository) Create(ctx context.Context, property *models.Property) error {
	// tenant_id is already set in the property model by service layer
	if err := r.db.WithContext(ctx).Create(property).Error; err != nil {
		return fmt.Errorf("failed to create property: %w", err)
	}
	return nil
}

// GetByID - STEP 11: Fetch property (tenant check happens in service layer)
func (r *propertyRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Property, error) {
	var property models.Property
	if err := r.db.WithContext(ctx).
		Preload("Address").
		Preload("AssessmentDetails").
		Preload("Amenities").
		Preload("ConstructionDetails").
		Preload(preloadConstructionDetailsFloorDetails).
		Preload("AdditionalDetails").
		Preload("GISData").
		Preload("Documents").
		Preload("IGRS").
		First(&property, QueryByID, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf(constants.ErrPropertyNotFound)
		}
		return nil, fmt.Errorf("failed to get property: %w", err)
	}
	return &property, nil
}

// Update - STEP 12: Update property (tenant_id already validated in service)
func (r *propertyRepository) Update(ctx context.Context, property *models.Property) error {
    // ✅ FIX: Use Save() which updates all fields including zero values
    result := r.db.WithContext(ctx).Save(property)
    
    if result.Error != nil {
        return fmt.Errorf("failed to update property with id %s: %w", property.ID, result.Error)
    }
    if result.RowsAffected == 0 {
        return fmt.Errorf("property with id %s not found for update", property.ID)
    }
    return nil
}

// Delete - STEP 13: Delete property (tenant ownership already validated)
func (r *propertyRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&models.Property{}, QueryByID, id)
	if result.Error != nil {
		return fmt.Errorf("failed to delete property: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf(constants.ErrPropertyNotFound)
	}
	return nil
}

func (r *propertyRepository) GetAll(ctx context.Context, tenantID string, page, size int, propertyType *string, status *string) ([]*models.Property, int64, error) {
	var properties []*models.Property
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Property{})

	if tenantID != "" {
		query = query.Where(`"tenant_id" = ?`, tenantID)
	}
	if propertyType != nil && *propertyType != "" {
		query = query.Where("property_type = ?", *propertyType)
	}
	if status != nil && *status != "" {
		query = query.Joins(`JOIN "DIGIT3"."applications" ON "DIGIT3"."properties"."id" = "DIGIT3"."applications"."property_id"`).
			Where(`"DIGIT3"."applications"."status" = ?`, *status)
	}
	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count properties: %w", err)
	}

	// Apply pagination
	offset := page * size
	if err := query.
		Preload("Address").
		Preload("AssessmentDetails").
		Preload("Amenities").
		Preload("ConstructionDetails").
		Preload(preloadConstructionDetailsFloorDetails).
		Preload("AdditionalDetails").
		Preload("GISData").
		Preload("Documents").
		Preload("IGRS").
		Offset(offset).
		Limit(size).
		Order("created_at DESC").
		Find(&properties).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to get properties: %w", err)
	}

	return properties, total, nil
}

// GetByPropertyNo - STEP 15: Fetch by property number (tenant check in service)
func (r *propertyRepository) GetByPropertyNo(ctx context.Context, propertyNo string) (*models.Property, error) {
	var property models.Property
	if err := r.db.WithContext(ctx).
		Preload("Address").
		Preload("AssessmentDetails").
		Preload("Amenities").
		Preload("ConstructionDetails").
		Preload(preloadConstructionDetailsFloorDetails).
		Preload("AdditionalDetails").
		Preload("GISData").
		Preload("Documents").
		Preload("IGRS").
		First(&property, "property_no = ?", propertyNo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf(constants.ErrPropertyNotFound)
		}
		return nil, fmt.Errorf("failed to get property: %w", err)
	}
	return &property, nil
}

// Search - STEP 16: ALWAYS filter by tenant ID with other criteria
func (r *propertyRepository) Search(ctx context.Context, params SearchPropertyParams) ([]*models.Property, int64, error) {
	var properties []*models.Property
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Property{})

	// STEP 16A: ALWAYS filter by tenant ID (CRITICAL - HIGHEST PRIORITY)
	if params.TenantID == "" {
		return nil, 0, fmt.Errorf("tenant ID is required for search")
	}
	query = query.Where("tenant_id = ?", params.TenantID)

	// Apply filters
	query = r.applyPropertyFilters(query, params)
	query = r.applyAddressFilters(query, params)

	// Count total matching records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count properties: %w", err)
	}

	// Apply sorting and pagination
	query = r.applySortingAndPagination(query, params)

	// Fetch results with preloads
	if err := r.fetchPropertiesWithPreloads(query).Find(&properties).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search properties: %w", err)
	}

	return properties, total, nil
}

func (r *propertyRepository) applyPropertyFilters(query *gorm.DB, params SearchPropertyParams) *gorm.DB {
	if params.PropertyType != nil && *params.PropertyType != "" {
		query = query.Where("property_type = ?", *params.PropertyType)
	}
	if params.OwnershipType != nil && *params.OwnershipType != "" {
		query = query.Where("ownership_type = ?", *params.OwnershipType)
	}
	if params.ComplexName != nil && *params.ComplexName != "" {
		query = query.Where("complex_name ILIKE ?", "%"+*params.ComplexName+"%")
	}
	return query
}

func (r *propertyRepository) applyAddressFilters(query *gorm.DB, params SearchPropertyParams) *gorm.DB {
	if params.Locality == nil && params.WardNo == nil && params.ZoneNo == nil && params.Street == nil {
		return query
	}

	query = query.Joins(`LEFT JOIN "DIGIT3"."property_addresses" ON "DIGIT3"."properties".id = "DIGIT3"."property_addresses".property_id`)

	if params.Locality != nil && *params.Locality != "" {
		query = query.Where(`"DIGIT3"."property_addresses".locality ILIKE ?`, "%"+*params.Locality+"%")
	}
	if params.WardNo != nil && *params.WardNo != "" {
		query = query.Where(`"DIGIT3"."property_addresses".ward_no = ?`, *params.WardNo)
	}
	if params.ZoneNo != nil && *params.ZoneNo != "" {
		query = query.Where(`"DIGIT3"."property_addresses".zone_no = ?`, *params.ZoneNo)
	}
	if params.Street != nil && *params.Street != "" {
		query = query.Where(`"DIGIT3"."property_addresses".street ILIKE ?`, "%"+*params.Street+"%")
	}
	return query
}

func (r *propertyRepository) applySortingAndPagination(query *gorm.DB, params SearchPropertyParams) *gorm.DB {
	sortBy := params.SortBy
	if sortBy == "" {
		sortBy = "created_at"
	}
	sortOrder := params.SortOrder
	if sortOrder == "" {
		sortOrder = "desc"
	}
	query = query.Order(fmt.Sprintf("%s %s", sortBy, sortOrder))

	offset := params.Page * params.Size
	return query.Offset(offset).Limit(params.Size)
}

func (r *propertyRepository) fetchPropertiesWithPreloads(query *gorm.DB) *gorm.DB {
	return query.
		Preload("Address").
		Preload("AssessmentDetails").
		Preload("Amenities").
		Preload("ConstructionDetails").
		Preload(preloadConstructionDetailsFloorDetails).
		Preload("AdditionalDetails").
		Preload("GISData").
		Preload("Documents").
		Preload("IGRS")
}
