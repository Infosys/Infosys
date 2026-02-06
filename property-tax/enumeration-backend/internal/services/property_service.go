package services

import (
	"context"
	"enumeration/internal/constants"
	"enumeration/internal/dto"
	"enumeration/internal/models"
	"enumeration/internal/repositories"
	"fmt"
	"time"

	"github.com/google/uuid"
)

var _ PropertyService = (*propertyService)(nil)

type propertyService struct {
	propertyRepo repositories.PropertyRepository
}

func NewPropertyService(propertyRepo repositories.PropertyRepository) PropertyService {
	return &propertyService{
		propertyRepo: propertyRepo,
	}
}

// CreateProperty - Validate tenant ID and create property
func (s *propertyService) CreateProperty(ctx context.Context, req *dto.CreatePropertyRequest, tenantID string) (*models.Property, error) {
	if req == nil {
		return nil, fmt.Errorf("%w: request is nil", ErrValidation)
	}
	// Generate property number if not provided
	propertyNo := req.PropertyNo
	if propertyNo == "" {
		var err error
		propertyNo, err = s.GeneratePropertyNo(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to generate property number: %w", err)
		}
	}

	// Create property model and SET tenant ID
	property := &models.Property{
		ID:                uuid.New(),
		TenantID:          tenantID,
		PropertyNo:        propertyNo,
		OwnershipType:     req.OwnershipType,
		PropertyType:      req.PropertyType,
		TypeOfLand:        req.TypeOfLand,
		ComplexName:       req.ComplexName,
		NoOfFloors:        req.NoOfFloors,
		NoOfBasements:     req.NoOfBasements,
		NoOfBuildings:     req.NoOfBuildings,
		BuildingName:      req.BuildingName,
		HasMezzanineFloor: req.HasMezzanineFloor,
	}

	// Pass to repository
	if err := s.propertyRepo.Create(ctx, property); err != nil {
		return nil, fmt.Errorf("failed to create property: %w", err)
	}

	return property, nil
}

// GetPropertyByID - Validate tenant ownership
func (s *propertyService) GetPropertyByID(ctx context.Context, id uuid.UUID, tenantID string) (*models.Property, error) {
	if id == uuid.Nil {
		return nil, fmt.Errorf("invalid property ID: cannot be nil")
	}
	// Fetch property
	property, err := s.propertyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Verify tenant ownership
	if property.TenantID != tenantID {
		return nil, fmt.Errorf("property does not belong to tenant")
	}

	return property, nil
}

// UpdateProperty - Validate tenant and update
func (s *propertyService) UpdateProperty(ctx context.Context, id uuid.UUID, req *dto.UpdatePropertyRequest, tenantID string) (*models.Property, error) {
	if req == nil {
		return nil, fmt.Errorf("%w: request is nil", ErrValidation)
	}
	if id == uuid.Nil {
		return nil, fmt.Errorf(constants.ErrInvalidPropertyIDNil)
	}
	// Fetch existing property
	existing, err := s.propertyRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	// Update only provided fields
	if req.OwnershipType != nil {
		existing.OwnershipType = *req.OwnershipType
	}
	if req.PropertyType != nil {
		existing.PropertyType = *req.PropertyType
	}
	if req.TypeOfLand != nil {
		existing.TypeOfLand = *req.TypeOfLand
	}
	if req.ComplexName != nil {
		existing.ComplexName = *req.ComplexName
	}
	if req.NoOfFloors != nil {
		existing.NoOfFloors = *req.NoOfFloors
	}
	if req.NoOfBasements != nil {
		existing.NoOfBasements = *req.NoOfBasements
	}
	if req.NoOfBuildings != nil {
		existing.NoOfBuildings = *req.NoOfBuildings
	}
	if req.BuildingName != nil {
		existing.BuildingName = *req.BuildingName
	}
	if req.HasMezzanineFloor != nil {
		existing.HasMezzanineFloor = *req.HasMezzanineFloor
	}

	// NEVER allow tenant ID to change
	existing.TenantID = tenantID
	// Update in repository
	if err := s.propertyRepo.Update(ctx, existing); err != nil {
		return nil, fmt.Errorf("failed to update property: %w", err)
	}

	// Fetch updated property
	return s.propertyRepo.GetByID(ctx, id)
}

// DeleteProperty - Validate tenant ownership before delete
func (s *propertyService) DeleteProperty(ctx context.Context, id uuid.UUID, tenantID string) error {
	if id == uuid.Nil {
		return fmt.Errorf("invalid property ID: cannot be nil")
	}
	// Fetch property
	property, err := s.propertyRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	// Verify tenant ownership
	if property.TenantID != tenantID {
		return fmt.Errorf(constants.ErrPropertyDoesNotBelongToTenant)
	}

	// Delete
	return s.propertyRepo.Delete(ctx, id)
}

// GetAllProperties - Filter by tenant ID
func (s *propertyService) GetAllProperties(ctx context.Context, tenantID string, page, size int, propertyType *string, status *string) ([]*models.Property, int64, error) {
	// Validate pagination
	if page < 0 {
		page = constants.DefaultPage
	}
	if size <= 0 || size > 100 {
		size = constants.DefaultSize
	}

	// Pass tenant ID to repository
	return s.propertyRepo.GetAll(ctx, tenantID, page, size, propertyType, status)
}

// GetPropertyByPropertyNo - Validate tenant ownership
func (s *propertyService) GetPropertyByPropertyNo(ctx context.Context, propertyNo, tenantID string) (*models.Property, error) {
	if propertyNo == "" {
		return nil, fmt.Errorf("property number is required")
	}
	// Fetch property
	property, err := s.propertyRepo.GetByPropertyNo(ctx, propertyNo)
	if err != nil {
		return nil, err
	}

	// Verify tenant ownership
	if property.TenantID != tenantID {
		return nil, fmt.Errorf("property does not belong to tenant")
	}

	return property, nil
}

// SearchProperties - Validate and filter by tenant
func (s *propertyService) SearchProperties(ctx context.Context, params SearchPropertyParams) ([]*models.Property, int64, error) {
	// Validate pagination
	if params.Page < 0 {
		params.Page = 0
	}
	if params.Size <= 0 || params.Size > 100 {
		params.Size = 20
	}

	// Build repository params
	repoParams := repositories.SearchPropertyParams{
		TenantID:      params.TenantID,
		Page:          params.Page,
		Size:          params.Size,
		PropertyType:  params.PropertyType,
		OwnershipType: params.OwnershipType,
		ComplexName:   params.ComplexName,
		Locality:      params.Locality,
		WardNo:        params.WardNo,
		ZoneNo:        params.ZoneNo,
		Street:        params.Street,
		SortBy:        params.SortBy,
		SortOrder:     params.SortOrder,
	}

	return s.propertyRepo.Search(ctx, repoParams)
}

// generatePropertyNo - Helper to generate unique property number
func (s *propertyService) GeneratePropertyNo(ctx context.Context) (string, error) {
	// Generate property number in format: PROP-YYYY-XXXXXX
	year := time.Now().Year()
	timestamp := time.Now().Unix()

	propertyNo := fmt.Sprintf("PROP-%d-%06d", year, timestamp%1000000)

	// Check if property number already exists (very unlikely but good to check)
	_, err := s.propertyRepo.GetByPropertyNo(ctx, propertyNo)
	if err == nil {
		// Property number exists, add random suffix
		propertyNo = fmt.Sprintf("%s-%d", propertyNo, time.Now().Nanosecond()%1000)
	}

	return propertyNo, nil
}
