package handlers

import (
	"enumeration/internal/constants"
	"enumeration/internal/dto"
	"enumeration/internal/models"
	"enumeration/internal/services"
	"enumeration/pkg/response"
	"enumeration/pkg/utils"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// PropertyAddressHandler handles HTTP requests for property address resources.
type PropertyAddressHandler struct {
	propertyAddressService services.PropertyAddressService // Service layer for property address operations
	applicationLogService  services.ApplicationLogService
}

// NewPropertyAddressHandler creates a new PropertyAddressHandler with the provided service.
func NewPropertyAddressHandler(propertyAddressService services.PropertyAddressService, applicationLogService services.ApplicationLogService) *PropertyAddressHandler {
	return &PropertyAddressHandler{
		propertyAddressService: propertyAddressService,
		applicationLogService:  applicationLogService,
	}
}

// CreatePropertyAddress handles POST requests to create a new property address record.
// Validates the request body and delegates creation to the service layer.
func (h *PropertyAddressHandler) CreatePropertyAddress(c *gin.Context) {
	var address models.PropertyAddress

	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	if err := h.propertyAddressService.CreatePropertyAddress(c.Request.Context(), &address); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to create property address", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, response.SuccessResponseBody("Property address created successfully", address))
}

// GetPropertyAddressByID handles GET requests to retrieve a property address by its ID.
func (h *PropertyAddressHandler) GetPropertyAddressByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidPropertyAddressIDFormat, err.Error()))
		return
	}

	address, err := h.propertyAddressService.GetPropertyAddressByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrPropertyAddressNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyAddressNotFound, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get property address", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property address retrieved successfully", address))
}

// UpdatePropertyAddress handles PUT requests to update an existing property address by its ID.
// Validates the request body and delegates update to the service layer.
func (h *PropertyAddressHandler) UpdatePropertyAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidPropertyAddressIDFormat, err.Error()))
		return
	}

	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}
	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	var address models.PropertyAddress
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	address.ID = id

	existingAddress, err := h.propertyAddressService.GetPropertyAddressByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrPropertyAddressNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyAddressNotFound, err.Error()))
			return
		}
	}

	if err := h.propertyAddressService.UpdatePropertyAddress(c.Request.Context(), &address); err != nil {
		if err.Error() == constants.ErrPropertyAddressNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyAddressNotFound, err.Error()))
			return
		}
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to update property address", err.Error()))
		return
	}

	if isVerifying && h.applicationLogService != nil && existingAddress != nil {
		comments := h.buildAddressChangeComments(existingAddress, &address)
		if err := h.logAddressChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log property address verification", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property address updated successfully", address))
}

func (h *PropertyAddressHandler) buildAddressChangeComments(existing, updated *models.PropertyAddress) string {
	changes := []string{}
	changes = append(changes, h.compareAddressStringFields(existing, updated)...)
	changes = append(changes, h.compareAddressNumericFields(existing, updated)...)
	if change := h.compareAddressBoolField(existing, updated); change != "" {
		changes = append(changes, change)
	}
	if len(changes) == 0 {
		return ""
	}
	return strings.Join(changes, ";\n") + ";\n"
}

func (h *PropertyAddressHandler) compareAddressStringFields(existing, updated *models.PropertyAddress) []string {
	changes := []string{}
	stringFields := map[string]struct{ existing, updated string }{
		"Property Address Locality":                {existing.Locality, updated.Locality},
		"Property Address Zone No":                 {existing.ZoneNo, updated.ZoneNo},
		"Property Address Ward No":                 {existing.WardNo, updated.WardNo},
		"Property Address Block No":                {existing.BlockNo, updated.BlockNo},
		"Property Address Street":                  {existing.Street, updated.Street},
		"Property Address Election Ward":           {existing.ElectionWard, updated.ElectionWard},
		"Property Address Secretariat Ward":        {existing.SecretariatWard, updated.SecretariatWard},
		"Property Address Correspondence Address1": {existing.CorrespondenceAddress1, updated.CorrespondenceAddress1},
		"Property Address Correspondence Address2": {existing.CorrespondenceAddress2, updated.CorrespondenceAddress2},
	}
	for fieldName, values := range stringFields {
		if len(values.updated) > 0 && values.existing != values.updated {
			if values.existing == "" {
				changes = append(changes, fieldName+" is added as "+values.updated)
			} else {
				changes = append(changes, fieldName+" is changed from "+values.existing+" to "+values.updated)
			}
		}
	}
	return changes
}

func (h *PropertyAddressHandler) compareAddressNumericFields(existing, updated *models.PropertyAddress) []string {
	changes := []string{}
	if updated.PinCode > 0 && existing.PinCode != updated.PinCode {
		if existing.PinCode == 0 {
			changes = append(changes, "Property Address PinCode is added as "+strconv.FormatUint(updated.PinCode, 10))
		} else {
			changes = append(changes, "Property Address PinCode is changed from "+strconv.FormatUint(existing.PinCode, 10)+" to "+strconv.FormatUint(updated.PinCode, 10))
		}
	}
	if updated.CorrespondencePincode > 0 && existing.CorrespondencePincode != updated.CorrespondencePincode {
		if existing.CorrespondencePincode == 0 {
			changes = append(changes, "Property Address Correspondence Pincode is added as "+strconv.Itoa(updated.CorrespondencePincode))
		} else {
			changes = append(changes, "Property Address Correspondence Pincode is changed from "+strconv.Itoa(existing.CorrespondencePincode)+" to "+strconv.Itoa(updated.CorrespondencePincode))
		}
	}
	return changes
}

func (h *PropertyAddressHandler) compareAddressBoolField(existing, updated *models.PropertyAddress) string {
	if existing.DifferentCorrespondenceAddress != updated.DifferentCorrespondenceAddress {
		return "Property Address DifferentCorrespondenceAddress is changed from " + strconv.FormatBool(existing.DifferentCorrespondenceAddress) + " to " + strconv.FormatBool(updated.DifferentCorrespondenceAddress)
	}
	return ""
}

// DeletePropertyAddress handles DELETE requests to remove a property address by its ID.
func (h *PropertyAddressHandler) DeletePropertyAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidPropertyAddressIDFormat, err.Error()))
		return
	}

	if err := h.propertyAddressService.DeletePropertyAddress(c.Request.Context(), id); err != nil {
		if err.Error() == constants.ErrPropertyAddressNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyAddressNotFound, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to delete property address", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property address deleted successfully", nil))
}

// GetAllPropertyAddresses handles GET requests to retrieve all property addresses with pagination and optional filtering by property ID.
// Sets pagination headers in the response.
func (h *PropertyAddressHandler) GetAllPropertyAddresses(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))

	var propertyID *uuid.UUID
	if propertyIDStr := c.Query("propertyId"); propertyIDStr != "" {
		if id, err := uuid.Parse(propertyIDStr); err == nil {
			propertyID = &id
		}
	}

	addresses, total, err := h.propertyAddressService.GetAllPropertyAddresses(c.Request.Context(), page, size, propertyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get property addresses", err.Error()))
		return
	}

	// Set pagination headers
	c.Header("X-Total-Count", strconv.FormatInt(total, 10))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))

	c.JSON(http.StatusOK, addresses)
}

// GetPropertyAddressByPropertyID handles GET requests to retrieve a property address by property ID.
func (h *PropertyAddressHandler) GetPropertyAddressByPropertyID(c *gin.Context) {
	propertyIDStr := c.Param("propertyId")
	propertyID, err := uuid.Parse(propertyIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid property ID", err.Error()))
		return
	}

	address, err := h.propertyAddressService.GetPropertyAddressByPropertyID(c.Request.Context(), propertyID)
	if err != nil {
		if err.Error() == constants.ErrPropertyAddressNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody("Property address not found for this property", err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get property address", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Property address retrieved successfully", address))
}

// SearchPropertyAddresses handles GET requests to search property addresses with advanced filters and pagination.
// Supports filtering by property ID, locality, zone, ward, block, street, election ward, secretariat ward, and pin code.
// Sets pagination headers in the response.
func (h *PropertyAddressHandler) SearchPropertyAddresses(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	sortBy := c.DefaultQuery("sortBy", "createdAt")
	sortOrder := c.DefaultQuery("sortOrder", "desc")

	params := services.SearchPropertyAddressParams{
		Page:      page,
		Size:      size,
		SortBy:    sortBy,
		SortOrder: sortOrder,
	}

	// Optional filters
	if propertyID := c.Query("propertyId"); propertyID != "" {
		if id, err := uuid.Parse(propertyID); err == nil {
			params.PropertyID = &id
		}
	}

	if locality := c.Query("locality"); locality != "" {
		params.Locality = &locality
	}

	if zoneNo := c.Query("zoneNo"); zoneNo != "" {
		params.ZoneNo = &zoneNo
	}

	if wardNo := c.Query("wardNo"); wardNo != "" {
		params.WardNo = &wardNo
	}

	if blockNo := c.Query("blockNo"); blockNo != "" {
		params.BlockNo = &blockNo
	}

	if street := c.Query("street"); street != "" {
		params.Street = &street
	}

	if electionWard := c.Query("electionWard"); electionWard != "" {
		params.ElectionWard = &electionWard
	}

	if secretariatWard := c.Query("secretariatWard"); secretariatWard != "" {
		params.SecretariatWard = &secretariatWard
	}

	if pinCodeStr := c.Query("pinCode"); pinCodeStr != "" {
		if pinCode, err := strconv.ParseUint(pinCodeStr, 10, 64); err == nil {
			params.PinCode = &pinCode
		}
	}

	addresses, total, err := h.propertyAddressService.SearchPropertyAddresses(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to search property addresses", err.Error()))
		return
	}

	// Set pagination headers
	c.Header("X-Total-Count", strconv.FormatInt(total, 10))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))

	c.JSON(http.StatusOK, addresses)
}

func (h *PropertyAddressHandler) logAddressChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" {
		return nil
	}
	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_ADDRESS",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}
	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
