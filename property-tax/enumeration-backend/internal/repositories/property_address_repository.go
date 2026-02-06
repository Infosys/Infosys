package repositories

import (
	"enumeration/internal/models"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Ensure propertyAddressRepository implements PropertyAddressRepository interface at compile time.
var _ PropertyAddressRepository = (*propertyAddressRepository)(nil)

// propertyAddressRepository provides implementation for PropertyAddressRepository using GORM for database operations.
type propertyAddressRepository struct {
	db *gorm.DB
}

// NewPropertyAddressRepository creates a new instance of propertyAddressRepository.
// db: GORM database connection.
// Returns: PropertyAddressRepository implementation.
func NewPropertyAddressRepository(db *gorm.DB) PropertyAddressRepository {
	return &propertyAddressRepository{db: db}
}

// Create inserts a new PropertyAddress record into the database.
// address: pointer to PropertyAddress model to be created.
// Returns: error if creation fails.
func (r *propertyAddressRepository) Create(address *models.PropertyAddress) error {
	if err := r.db.Create(address).Error; err != nil {
		return fmt.Errorf("failed to create property address: %w", err)
	}
	return nil
}

// GetByID retrieves a PropertyAddress by its unique ID.
// id: UUID of the property address.
// Returns: pointer to PropertyAddress and error if not found or on failure.
func (r *propertyAddressRepository) GetByID(id uuid.UUID) (*models.PropertyAddress, error) {
	var address models.PropertyAddress
	err := r.db.Where(QueryByID, id).First(&address).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("property address with id %s not found", id)
		}
		return nil, fmt.Errorf("failed to get property address by id %s: %w", id, err)
	}
	return &address, nil
}

// Update modifies an existing PropertyAddress record in the database.
// address: pointer to PropertyAddress model with updated data.
// Returns: error if update fails or record not found.
func (r *propertyAddressRepository) Update(address *models.PropertyAddress) error {
	result := r.db.Save(address)
	if result.Error != nil {
		return fmt.Errorf("failed to update property address with id %s: %w", address.ID, result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("property address with id %s not found for update", address.ID)
	}
	return nil
}

// Delete removes a PropertyAddress record by its unique ID.
// id: UUID of the property address to delete.
// Returns: error if deletion fails or record not found.
func (r *propertyAddressRepository) Delete(id uuid.UUID) error {
	result := r.db.Delete(&models.PropertyAddress{}, QueryByID, id)
	if result.Error != nil {
		return fmt.Errorf("failed to delete property address with id %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("property address with id %s not found for deletion", id)
	}
	return nil
}

// GetAll retrieves all PropertyAddress records, optionally filtered by propertyID, with pagination.
// page: page number (zero-based), size: number of records per page, propertyID: optional filter.
// Returns: slice of PropertyAddress pointers, total count, and error if any.
func (r *propertyAddressRepository) GetAll(page, size int, propertyID *uuid.UUID) ([]*models.PropertyAddress, int64, error) {
	var addresses []*models.PropertyAddress
	var total int64

	query := r.db.Model(&models.PropertyAddress{})

	if propertyID != nil {
		query = query.Where(QueryByPropertyID, *propertyID)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count property addresses: %w", err)
	}

	// Apply pagination
	offset := page * size
	if err := query.Offset(offset).Limit(size).Find(&addresses).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, 0, fmt.Errorf("no property addresses found")
		}
		return nil, 0, fmt.Errorf("failed to get property addresses: %w", err)
	}

	return addresses, total, nil
}

// GetByPropertyID retrieves a PropertyAddress by its associated property ID.
// propertyID: UUID of the property.
// Returns: pointer to PropertyAddress and error if not found or on failure.
func (r *propertyAddressRepository) GetByPropertyID(propertyID uuid.UUID) (*models.PropertyAddress, error) {
	var address models.PropertyAddress
	err := r.db.Where(QueryByPropertyID, propertyID).First(&address).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("property address with property id %s not found", propertyID)
		}
		return nil, fmt.Errorf("failed to get property address by property id %s: %w", propertyID, err)
	}
	return &address, nil
}

// Search finds PropertyAddress records matching the given search parameters, with filtering, sorting, and pagination.
// params: SearchPropertyAddressParams struct with filter and pagination options.
// Returns: slice of PropertyAddress pointers, total count, and error if any.
func (r *propertyAddressRepository) Search(params SearchPropertyAddressParams) ([]*models.PropertyAddress, int64, error) {
	var addresses []*models.PropertyAddress
	var total int64

	query := r.db.Model(&models.PropertyAddress{})

	// Apply filters
	query = r.applySearchFilters(query, params)

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count property addresses: %w", err)
	}

	// Apply sorting and pagination
	orderBy := r.buildOrderByClause(params.SortBy, params.SortOrder)
	offset := params.Page * params.Size
	if err := query.Order(orderBy).Offset(offset).Limit(params.Size).Find(&addresses).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, 0, fmt.Errorf("no property addresses found for search params")
		}
		return nil, 0, fmt.Errorf("failed to get property addresses: %w", err)
	}
	return addresses, total, nil
}

// applySearchFilters applies all search filters to the query
func (r *propertyAddressRepository) applySearchFilters(query *gorm.DB, params SearchPropertyAddressParams) *gorm.DB {
	var conditions []string
	var args []interface{}

	r.addPropertyIDFilter(&conditions, &args, params.PropertyID)
	r.addStringFilter(&conditions, &args, params.Locality, "locality", true)
	r.addStringFilter(&conditions, &args, params.ZoneNo, "zone_no", false)
	r.addStringFilter(&conditions, &args, params.WardNo, "ward_no", false)
	r.addStringFilter(&conditions, &args, params.BlockNo, "block_no", false)
	r.addStringFilter(&conditions, &args, params.Street, "street", true)
	r.addStringFilter(&conditions, &args, params.ElectionWard, "election_ward", false)
	r.addStringFilter(&conditions, &args, params.SecretariatWard, "secretariat_ward", false)
	r.addUint64Filter(&conditions, &args, params.PinCode, "pin_code")

	if len(conditions) > 0 {
		query = query.Where(strings.Join(conditions, " AND "), args...)
	}
	return query
}

// addPropertyIDFilter adds property ID filter if present
func (r *propertyAddressRepository) addPropertyIDFilter(conditions *[]string, args *[]interface{}, propertyID *uuid.UUID) {
	if propertyID != nil {
		*conditions = append(*conditions, QueryByPropertyID)
		*args = append(*args, *propertyID)
	}
}

// addStringFilter adds string filter with specified operator (= or ILIKE)
func (r *propertyAddressRepository) addStringFilter(conditions *[]string, args *[]interface{}, value *string, column string, useLike bool) {
	if value != nil && *value != "" {
		if useLike {
			*conditions = append(*conditions, fmt.Sprintf("%s ILIKE ?", column))
			*args = append(*args, "%"+*value+"%")
		} else {
			*conditions = append(*conditions, fmt.Sprintf("%s = ?", column))
			*args = append(*args, *value)
		}
	}
}

// addUint64Filter adds equality filter for uint64 fields
func (r *propertyAddressRepository) addUint64Filter(conditions *[]string, args *[]interface{}, value *uint64, column string) {
	if value != nil {
		*conditions = append(*conditions, fmt.Sprintf("%s = ?", column))
		*args = append(*args, *value)
	}
}

// buildOrderByClause builds the ORDER BY clause based on sortBy and sortOrder parameters
func (r *propertyAddressRepository) buildOrderByClause(sortBy, sortOrder string) string {
	if sortBy == "" {
		return "created_at DESC"
	}

	direction := "ASC"
	if strings.ToUpper(sortOrder) == "DESC" {
		direction = "DESC"
	}

	switch sortBy {
	case "locality":
		return fmt.Sprintf("locality %s", direction)
	case "zoneNo":
		return fmt.Sprintf("zone_no %s", direction)
	case "wardNo":
		return fmt.Sprintf("ward_no %s", direction)
	case "createdAt":
		return fmt.Sprintf("created_at %s", direction)
	case "updatedAt":
		return fmt.Sprintf("updated_at %s", direction)
	default:
		return "created_at DESC"
	}
}
