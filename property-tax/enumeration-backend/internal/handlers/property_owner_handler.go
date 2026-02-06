package handlers

import (
	"bytes"
	"encoding/json"
	"enumeration/internal/constants"
	"enumeration/internal/dto"
	"enumeration/internal/models"
	"enumeration/internal/services"
	"enumeration/pkg/response"
	"enumeration/pkg/utils"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// PropertyOwnerHandler handles HTTP requests for property owner resources.
type PropertyOwnerHandler struct {
	service               services.PropertyOwnerService // Service layer for property owner operations
	applicationLogService services.ApplicationLogService
}

// NewPropertyOwnerHandler creates a new PropertyOwnerHandler with the provided service.
func NewPropertyOwnerHandler(service services.PropertyOwnerService, applicationLogService services.ApplicationLogService) *PropertyOwnerHandler {
	return &PropertyOwnerHandler{service: service, applicationLogService: applicationLogService}
}

// Create handles POST /property-owners (single).
// Validates the request body and delegates creation to the service layer.
func (h *PropertyOwnerHandler) Create(c *gin.Context) {
	var req dto.CreatePropertyOwnerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidRequestBodyFormat, "errors": []string{err.Error()}})
		return
	}

	owner, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		if errors.Is(err, services.ErrValidation) {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid property owner", "errors": []string{err.Error()}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create property owner", "errors": []string{err.Error()}})
		return
	}

	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"
	applicationId, err := uuid.Parse((c.Param("applicationId")))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}

	if isVerifying {
		comments := "New owner created: " + owner.Name + ";\n"
		userName, userRole := utils.GetUserInfoFromContext(c)

		appLogReq := &dto.CreateApplicationLogRequest{
			ApplicationID: applicationId,
			Action:        "ADD_OWNER",
			Actor:         userRole,
			PerformedBy:   userName,
			Comments:      comments,
			Metadata:      map[string]interface{}{},
		}
		if _, err := h.applicationLogService.Create(c.Request.Context(), appLogReq); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log property owner creation", err.Error()))
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Property owner created successfully", "data": owner})
}

// CreateBatch handles POST /property-owners/batch and accepts either a single object or an array.
// Supports both single and batch creation of property owners by detecting the request body type.
func (h *PropertyOwnerHandler) CreateBatch(c *gin.Context) {
	raw, err := c.GetRawData()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidRequestBodyFormat, "errors": []string{err.Error()}})
		return
	}
	trimmed := bytes.TrimLeft(raw, " \t\r\n")
	if len(trimmed) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Empty request body"})
		return
	}

	var reqPtrs []*dto.CreatePropertyOwnerRequest
	if trimmed[0] == '[' {
		// Handle array of property owners
		var arr []dto.CreatePropertyOwnerRequest
		if err := json.Unmarshal(raw, &arr); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidRequestBodyFormat, "errors": []string{err.Error()}})
			return
		}
		reqPtrs = make([]*dto.CreatePropertyOwnerRequest, 0, len(arr))
		for i := range arr {
			reqPtrs = append(reqPtrs, &arr[i])
		}
	} else {
		// Handle single property owner
		var single dto.CreatePropertyOwnerRequest
		if err := json.Unmarshal(raw, &single); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidRequestBodyFormat, "errors": []string{err.Error()}})
			return
		}
		reqPtrs = []*dto.CreatePropertyOwnerRequest{&single}
	}

	owners, err := h.service.CreatePropertyOwners(c.Request.Context(), reqPtrs)
	if err != nil {
		if errors.Is(err, services.ErrValidation) {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid property owners payload", "errors": []string{err.Error()}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create property owners", "errors": []string{err.Error()}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Property owners created successfully", "data": owners})
}

// GetByPropertyID handles GET /property-owners/property/:propertyId?page=0&size=20
// Retrieves property owners for a given property ID with pagination support.
// Sets pagination headers in the response.
func (h *PropertyOwnerHandler) GetByPropertyID(c *gin.Context) {
	propertyID, err := uuid.Parse(c.Param("propertyId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid property ID", "errors": []string{err.Error()}})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	if size <= 0 {
		size = 20
	}
	owners, total, err := h.service.GetByPropertyID(c.Request.Context(), propertyID, page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to retrieve property owners", "errors": []string{err.Error()}})
		return
	}

	// Calculate total pages for pagination
	totalPages := 0
	if total > 0 {
		totalPages = int((total + int64(size) - 1) / int64(size))
	}

	c.Header(constants.HeaderTotalCount, strconv.FormatInt(total, 10))
	c.Header(constants.HeaderCurrentPage, strconv.Itoa(page))
	c.Header(constants.HeaderPerPage, strconv.Itoa(size))
	c.Header(constants.HeaderTotalPages, strconv.Itoa(totalPages))

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Property owners retrieved successfully", "data": owners})
}

// Update handles PUT /property-owners/:id
// Updates an existing property owner by ID. Validates the request body and delegates update to the service layer.
func (h *PropertyOwnerHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidPropertyOwnerIDFormat, "errors": []string{err.Error()}})
		return
	}

	applicationId, err := uuid.Parse((c.Param("applicationId")))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}
	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	var req dto.UpdatePropertyOwnerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidRequestBodyFormat, "errors": []string{err.Error()}})
		return
	}

	// Fetch the specific owner being updated
	existingOwner, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		h.handleOwnerRetrievalError(c, err)
		return
	}

	owner, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		h.handleOwnerUpdateError(c, err)
		return
	}

	// Log changes if verifying
	if isVerifying && h.applicationLogService != nil && existingOwner != nil {
		comments := h.buildOwnerChangeComments(existingOwner, &req)
		if err := h.logOwnerChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log property owner verification", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Property owner updated successfully", "data": owner})
}

func (h *PropertyOwnerHandler) handleOwnerRetrievalError(c *gin.Context, err error) {
	switch err.Error() {
	case constants.ErrPropertyNotFound:
		c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrPropertyNotFound, err.Error()))
	case constants.ErrPropertyDoesNotBelongToTenant:
		c.JSON(http.StatusForbidden, response.ErrorResponseBody(constants.ErrAccessDeniedPropertyBelongsDifferentTenant, ""))
	default:
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to retrieve property owner", err.Error()))
	}
}

func (h *PropertyOwnerHandler) handleOwnerUpdateError(c *gin.Context, err error) {
	if errors.Is(err, services.ErrValidation) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid update payload", "errors": []string{err.Error()}})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Failed to update property owner", "errors": []string{err.Error()}})
}

func (h *PropertyOwnerHandler) buildOwnerChangeComments(existing *models.PropertyOwner, updated *dto.UpdatePropertyOwnerRequest) string {
	changes := []string{}
	changes = append(changes, h.compareOwnerStringFields(existing, updated)...)
	changes = append(changes, h.compareOwnerFloatField(existing, updated)...)
	changes = append(changes, h.compareOwnerBoolField(existing, updated)...)
	changes = append(changes, h.compareOwnerUintField(existing, updated)...)
	if len(changes) == 0 {
		return ""
	}
	return strings.Join(changes, "")
}

func (h *PropertyOwnerHandler) compareOwnerStringFields(existing *models.PropertyOwner, updated *dto.UpdatePropertyOwnerRequest) []string {
	changes := []string{}
	stringFields := map[string]struct {
		existing string
		updated  string
	}{
		"Name":                   {existing.Name, updated.Name},
		"Contact No":              {existing.ContactNo, updated.ContactNo},
		"Email":                  {existing.Email, updated.Email},
		"Gender":                 {existing.Gender, updated.Gender},
		"Guardian":               {existing.Guardian, updated.Guardian},
		"Guardian Type":           {existing.GuardianType, updated.GuardianType},
		"Relationship To Property": {existing.RelationshipToProperty, updated.RelationshipToProperty},
	}
	for fieldName, values := range stringFields {
		if len(values.updated) == 0 {
			continue
		}
		if values.existing != values.updated {
			if values.existing == "" {
				changes = append(changes, fieldName+" is added as "+values.updated+";\n")
			} else if fieldName == "GuardianType" && !strings.EqualFold(values.existing, values.updated) {
				changes = append(changes, fieldName+" is changed from "+values.existing+" to "+values.updated+";\n")
			} else if fieldName != "GuardianType" {
				changes = append(changes, fieldName+" is changed from "+values.existing+" to "+values.updated+";\n")
			}
		}
	}
	return changes
}

func (h *PropertyOwnerHandler) compareOwnerFloatField(existing *models.PropertyOwner, updated *dto.UpdatePropertyOwnerRequest) []string {
	changes := []string{}
	if updated.OwnershipShare > 0 && existing.OwnershipShare != updated.OwnershipShare {
		existingVal := utils.FormatFloat(existing.OwnershipShare)
		updatedVal := utils.FormatFloat(updated.OwnershipShare)
		if existing.OwnershipShare == 0 {
			changes = append(changes, "OwnershipShare is added as "+updatedVal+";\n")
		} else {
			changes = append(changes, "OwnershipShare is changed from "+existingVal+" to "+updatedVal+";\n")
		}
	}
	return changes
}

func (h *PropertyOwnerHandler) compareOwnerBoolField(existing *models.PropertyOwner, updated *dto.UpdatePropertyOwnerRequest) []string {
	changes := []string{}
	if existing.IsPrimaryOwner != updated.IsPrimaryOwner {
		changes = append(changes, "IsPrimaryOwner is changed from "+strconv.FormatBool(existing.IsPrimaryOwner)+" to "+strconv.FormatBool(updated.IsPrimaryOwner)+";\n")
	}
	return changes
}

func (h *PropertyOwnerHandler) compareOwnerUintField(existing *models.PropertyOwner, updated *dto.UpdatePropertyOwnerRequest) []string {
	changes := []string{}
	if updated.AdhaarNo > 0 && existing.AdhaarNo != updated.AdhaarNo {
		if existing.AdhaarNo == 0 {
			changes = append(changes, "AdhaarNo is added as "+strconv.FormatUint(updated.AdhaarNo, 10)+";\n")
		} else {
			changes = append(changes, "AdhaarNo is changed from "+strconv.FormatUint(existing.AdhaarNo, 10)+" to "+strconv.FormatUint(updated.AdhaarNo, 10)+";\n")
		}
	}
	return changes
}

// Delete handles DELETE /property-owners/:id
// Deletes a property owner by ID. Delegates deletion to the service layer.
func (h *PropertyOwnerHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidPropertyOwnerIDFormat, "errors": []string{err.Error()}})
		return
	}

	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"
	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidApplicationID, "errors": []string{err.Error()}})
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Failed to delete property owner", "errors": []string{err.Error()}})
		return
	}

	if isVerifying && h.applicationLogService != nil {
		comments := "Owner deleted with ID: " + id.String() + ";\n"
		userName, userRole := utils.GetUserInfoFromContext(c)
		appLogReq := &dto.CreateApplicationLogRequest{
			ApplicationID: applicationId,
			Action:        "DELETE_OWNER",
			Actor:         userRole,
			PerformedBy:   userName,
			Comments:      comments,
			Metadata:      map[string]interface{}{},
		}
		if _, err := h.applicationLogService.Create(c.Request.Context(), appLogReq); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log property owner deletion", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Property owner deleted successfully"})
}

func (h *PropertyOwnerHandler) logOwnerChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" || h.applicationLogService == nil {
		return nil
	}
	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_OWNER",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}
	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
