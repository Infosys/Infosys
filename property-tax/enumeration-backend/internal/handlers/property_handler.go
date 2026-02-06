package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"enumeration/internal/constants"
	"enumeration/internal/dto"
	"enumeration/internal/models"
	"enumeration/internal/services"
	"enumeration/pkg/response"
	"enumeration/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type PropertyHandler struct {
	propertyService       services.PropertyService
	applicationLogService services.ApplicationLogService
}

func NewPropertyHandler(propertyService services.PropertyService, applicationLogService services.ApplicationLogService) *PropertyHandler {
	return &PropertyHandler{
		propertyService:       propertyService,
		applicationLogService: applicationLogService,
	}
}

// CreateProperty - Extract tenant ID from header
func (h *PropertyHandler) CreateProperty(c *gin.Context) {
	// Extract tenant ID from header
	tenantID := c.GetHeader(constants.HeaderTenantID)
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrTenantIDHeaderRequired, ""))
		return
	}

	var req dto.CreatePropertyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	// Pass tenant ID to service
	property, err := h.propertyService.CreateProperty(c.Request.Context(), &req, tenantID)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to create property", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, response.SuccessResponseBody("Property created successfully", property))
}

// GetPropertyByID - Extract and validate tenant
func (h *PropertyHandler) GetPropertyByID(c *gin.Context) {
	// Extract tenant ID from header
	tenantID := c.GetHeader(constants.HeaderTenantID)
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrTenantIDHeaderRequired, ""))
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidPropertyIDFormat, err.Error()))
		return
	}

	// Pass tenant ID to service
	property, err := h.propertyService.GetPropertyByID(c.Request.Context(), id, tenantID)
	if err != nil {
		if err.Error() == constants.ErrPropertyNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyNotFound, err.Error()))
			return
		}
		if err.Error() == constants.ErrPropertyDoesNotBelongToTenant {
			c.JSON(http.StatusForbidden, response.ErrorResponseBody(constants.ErrAccessDeniedPropertyBelongsDifferentTenant, ""))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to retrieve property", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property retrieved successfully", property))
}

// UpdateProperty - Extract tenant ID and validate ownership
func (h *PropertyHandler) UpdateProperty(c *gin.Context) {
	// Extract tenant ID from header
	tenantID := c.GetHeader(constants.HeaderTenantID)
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrTenantIDHeaderRequired, ""))
		return
	}

	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	// Parse and validate IDs
	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidPropertyIDFormat, err.Error()))
		return
	}

	// Parse request body
	var req dto.UpdatePropertyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	// Fetch existing property
	existingProperty, err := h.propertyService.GetPropertyByID(c.Request.Context(), id, tenantID)
	if err != nil {
		h.handlePropertyNotFoundError(c, err)
		return
	}

	// Pass tenant ID to service
	property, err := h.propertyService.UpdateProperty(c.Request.Context(), id, &req, tenantID)
	if err != nil {
		if err.Error() == constants.ErrPropertyNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyNotFound, err.Error()))
			return
		}
		if err.Error() == constants.ErrPropertyDoesNotBelongToTenant {
			c.JSON(http.StatusForbidden, response.ErrorResponseBody(constants.ErrAccessDeniedPropertyBelongsDifferentTenant, ""))
			return
		}
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to update property", err.Error()))
		return
	}

	if isVerifying && h.applicationLogService != nil {
		comments := h.buildPropertyChangeComments(existingProperty, &req)
		if err := h.logPropertyChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log property verification", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property updated successfully", property))
}

func (h *PropertyHandler) handlePropertyNotFoundError(c *gin.Context, err error) {
	switch err.Error() {
	case constants.ErrPropertyNotFound:
		c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyNotFound, err.Error()))
	case constants.ErrPropertyDoesNotBelongToTenant:
		c.JSON(http.StatusForbidden, response.ErrorResponseBody(constants.ErrAccessDeniedPropertyBelongsDifferentTenant, ""))
	default:
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to retrieve property", err.Error()))
	}
}

func (h *PropertyHandler) buildPropertyChangeComments(existing *models.Property, updated *dto.UpdatePropertyRequest) string {
	changes := []string{}
	changes = append(changes, h.comparePropertyStringFields(existing, updated)...)
	changes = append(changes, h.comparePropertyIntFields(existing, updated)...)
	if change := h.comparePropertyBoolField(existing, updated); change != "" {
		changes = append(changes, change)
	}
	if len(changes) == 0 {
		return ""
	}
	return strings.Join(changes, ";\n") + ";\n"
}

func (h *PropertyHandler) comparePropertyStringFields(existing *models.Property, updated *dto.UpdatePropertyRequest) []string {
	changes := []string{}
	stringFields := map[string]struct {
		existing string
		updated  *string
	}{
		"Ownership Type": {existing.OwnershipType, updated.OwnershipType},
		"Property Type":  {existing.PropertyType, updated.PropertyType},
		"Complex Name":   {existing.ComplexName, updated.ComplexName},
		"Type of Land":   {existing.TypeOfLand, updated.TypeOfLand},
		"Building Name":  {existing.BuildingName, updated.BuildingName},
	}
	for fieldName, values := range stringFields {
		if values.updated != nil && values.existing != *values.updated {
			if values.existing == "" {
				changes = append(changes, fieldName+" is added as "+*values.updated)
			} else {
				changes = append(changes, fieldName+" is changed from "+values.existing+" to "+*values.updated)
			}
		}
	}
	return changes
}

func (h *PropertyHandler) comparePropertyIntFields(existing *models.Property, updated *dto.UpdatePropertyRequest) []string {
	changes := []string{}
	intFields := map[string]struct {
		existing int
		updated  *int
	}{
		"No Of Floors":    {existing.NoOfFloors, updated.NoOfFloors},
		"No Of Basements": {existing.NoOfBasements, updated.NoOfBasements},
		"No Of Buildings": {existing.NoOfBuildings, updated.NoOfBuildings},
	}
	for fieldName, values := range intFields {
		if values.updated != nil && values.existing != *values.updated {
			if values.existing == 0 {
				changes = append(changes, fieldName+" is added as "+strconv.Itoa(*values.updated))
			} else {
				changes = append(changes, fieldName+" is changed from "+strconv.Itoa(values.existing)+" to "+strconv.Itoa(*values.updated))
			}
		}
	}
	return changes
}

func (h *PropertyHandler) comparePropertyBoolField(existing *models.Property, updated *dto.UpdatePropertyRequest) string {
	if updated.HasMezzanineFloor != nil && existing.HasMezzanineFloor != *updated.HasMezzanineFloor {
		return "Has Mezzanine Floor changed from " + strconv.FormatBool(existing.HasMezzanineFloor) + " to " + strconv.FormatBool(*updated.HasMezzanineFloor)
	}
	return ""
}

// DeleteProperty - Extract tenant ID and validate ownership
func (h *PropertyHandler) DeleteProperty(c *gin.Context) {
	// Extract tenant ID from header
	tenantID := c.GetHeader(constants.HeaderTenantID)
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrTenantIDHeaderRequired, ""))
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidPropertyIDFormat, err.Error()))
		return
	}

	// Pass tenant ID to service
	if err := h.propertyService.DeleteProperty(c.Request.Context(), id, tenantID); err != nil {
		if err.Error() == constants.ErrPropertyNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyNotFound, err.Error()))
			return
		}
		if err.Error() == constants.ErrPropertyDoesNotBelongToTenant {
			c.JSON(http.StatusForbidden, response.ErrorResponseBody(constants.ErrAccessDeniedPropertyBelongsDifferentTenant, ""))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to delete property", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property deleted successfully", nil))
}

// GetAllProperties - Extract tenant ID for filtering
func (h *PropertyHandler) GetAllProperties(c *gin.Context) {
	// Extract tenant ID from header
	tenantID := c.GetHeader(constants.HeaderTenantID)
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrTenantIDHeaderRequired, ""))
		return
	}
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	isCountOnly := c.DefaultQuery("isCountOnly", "false") == "true"

	var propertyType *string
	if propertyTypeStr := c.Query("propertyType"); propertyTypeStr != "" {
		propertyType = &propertyTypeStr
	}

	var status *string
	if statusStr := c.Query("status"); statusStr != "" {
		status = &statusStr
	}

	properties, total, err := h.propertyService.GetAllProperties(c.Request.Context(), tenantID, page, size, propertyType, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get properties", err.Error()))
		return
	}

	// Set pagination headers
	c.Header("X-Total-Count", strconv.FormatInt(total, 20))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))

	if isCountOnly {
		c.JSON(http.StatusOK, map[string]int64{"total": total})
		return
	}
	c.JSON(http.StatusOK, properties)
}

// GetPropertyByPropertyNo - Extract tenant ID
func (h *PropertyHandler) GetPropertyByPropertyNo(c *gin.Context) {
	// Extract tenant ID from header
	tenantID := c.GetHeader(constants.HeaderTenantID)
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrTenantIDHeaderRequired, ""))
		return
	}

	propertyNo := c.Param("propertyNo")
	if propertyNo == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Property number is required", ""))
		return
	}

	// Pass tenant ID to service
	property, err := h.propertyService.GetPropertyByPropertyNo(c.Request.Context(), propertyNo, tenantID)
	if err != nil {
		if err.Error() == constants.ErrPropertyNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyNotFound, err.Error()))
			return
		}
		if err.Error() == constants.ErrPropertyDoesNotBelongToTenant {
			c.JSON(http.StatusForbidden, response.ErrorResponseBody(constants.ErrAccessDeniedPropertyBelongsDifferentTenant, ""))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get property", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property retrieved successfully", property))
}

// SearchProperties - Extract tenant ID for filtering
func (h *PropertyHandler) SearchProperties(c *gin.Context) {
	// Extract tenant ID from header
	tenantID := c.GetHeader(constants.HeaderTenantID)
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrTenantIDHeaderRequired, ""))
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	sortBy := c.DefaultQuery("sortBy", "property_no")
	sortOrder := c.DefaultQuery("sortOrder", "desc")

	// Build search params with tenant ID
	params := services.SearchPropertyParams{
		TenantID:  tenantID, // Always set from header
		Page:      page,
		Size:      size,
		SortBy:    sortBy,
		SortOrder: sortOrder,
	}

	// Optional filters
	if propertyType := c.Query("propertyType"); propertyType != "" {
		params.PropertyType = &propertyType
	}
	if ownershipType := c.Query("ownershipType"); ownershipType != "" {
		params.OwnershipType = &ownershipType
	}
	if complexName := c.Query("complexName"); complexName != "" {
		params.ComplexName = &complexName
	}
	if locality := c.Query("locality"); locality != "" {
		params.Locality = &locality
	}
	if wardNo := c.Query("wardNo"); wardNo != "" {
		params.WardNo = &wardNo
	}
	if zoneNo := c.Query("zoneNo"); zoneNo != "" {
		params.ZoneNo = &zoneNo
	}
	if street := c.Query("street"); street != "" {
		params.Street = &street
	}

	// Pass to service
	properties, total, err := h.propertyService.SearchProperties(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to search properties", err.Error()))
		return
	}

	// Set pagination headers
	c.Header("X-Total-Count", strconv.FormatInt(total, 10))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))

	c.JSON(http.StatusOK, properties)
}

func (h *PropertyHandler) logPropertyChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" || h.applicationLogService == nil {
		return nil
	}
	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_PROPERTY",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}
	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
