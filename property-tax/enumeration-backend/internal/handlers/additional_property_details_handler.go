// Package handlers contains HTTP handlers for API endpoints
package handlers

import (
	"encoding/json"
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

type AdditionalPropertyDetailsHandler struct {
	service               services.AdditionalPropertyDetailsService // Business logic service
	applicationLogService services.ApplicationLogService
}

// NewAdditionalPropertyDetailsHandler creates a new handler instance
func NewAdditionalPropertyDetailsHandler(service services.AdditionalPropertyDetailsService, applicationLogService services.ApplicationLogService) *AdditionalPropertyDetailsHandler {
	return &AdditionalPropertyDetailsHandler{
		service:               service,
		applicationLogService: applicationLogService,
	}
}

// CreateAdditionalPropertyDetailsRequest is the request body for creating additional property details
type CreateAdditionalPropertyDetailsRequest struct {
	FieldName  string      `json:"fieldName" binding:"required"`
	FieldValue interface{} `json:"fieldValue" binding:"required"`
	PropertyID uuid.UUID   `json:"propertyId" binding:"required"`
}

// UpdateAdditionalPropertyDetailsRequest is the request body for updating additional property details
type UpdateAdditionalPropertyDetailsRequest struct {
	FieldName  string      `json:"fieldName" binding:"required"`
	FieldValue interface{} `json:"fieldValue" binding:"required"`
	PropertyID uuid.UUID   `json:"propertyId" binding:"required"`
}

// CreateAdditionalPropertyDetails handles POST to create a new additional property details record
func (h *AdditionalPropertyDetailsHandler) CreateAdditionalPropertyDetails(c *gin.Context) {
	var req CreateAdditionalPropertyDetailsRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	// Convert interface{} to JSON bytes
	fieldValueBytes, err := json.Marshal(req.FieldValue)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid field value format", err.Error()))
		return
	}

	details := models.AdditionalPropertyDetails{
		FieldName:  req.FieldName,
		FieldValue: fieldValueBytes,
		PropertyID: req.PropertyID,
	}

	if err := h.service.CreateAdditionalPropertyDetails(c.Request.Context(), &details); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to create additional property details", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, response.SuccessResponseBody("Additional property details created successfully", details))
}

// GetAdditionalPropertyDetailsByID handles GET by ID for additional property details
func (h *AdditionalPropertyDetailsHandler) GetAdditionalPropertyDetailsByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidIdFormat, err.Error()))
		return
	}

	details, err := h.service.GetAdditionalPropertyDetailsByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrAdditionalPropertyDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrAdditionalPropertyDetailsNotFound))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody(constants.ErrInternalServer, err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody(constants.MsgAdditionalPropertyDetailsRetrieved, details))
}

// compareFieldValues compares old and new field values and returns a list of changes
func (h *AdditionalPropertyDetailsHandler) compareFieldValues(oldValue, newValue map[string]interface{}) []string {
	changes := []string{}
	fieldsToCheck := []string{"DocumentType", "revenueDocumentNo", "serialNo"}

	for _, field := range fieldsToCheck {
		oldVal, oldExists := oldValue[field]
		newVal, newExists := newValue[field]

		if oldVal != newVal {
			oldValStr := utils.FormatValue(oldVal, oldExists)
			newValStr := utils.FormatValue(newVal, newExists)
			changes = append(changes, utils.FormatString(field)+" changed from "+oldValStr+" to "+newValStr)
		}
	}
	return changes
}

// extractValueChanges extracts specific field changes from JSON values
func (h *AdditionalPropertyDetailsHandler) extractValueChanges(oldJSON, newJSON []byte) []string {
	var oldValue, newValue map[string]interface{}

	if err := json.Unmarshal(oldJSON, &oldValue); err != nil {
		return []string{}
	}
	if err := json.Unmarshal(newJSON, &newValue); err != nil {
		return []string{}
	}

	return h.compareFieldValues(oldValue, newValue)
}

// buildChangeComments constructs change comments from old and new details
func (h *AdditionalPropertyDetailsHandler) buildChangeComments(existingDetails, details *models.AdditionalPropertyDetails) string {
	var comments strings.Builder
	changes := []string{}

	if existingDetails.FieldName != details.FieldName {
		changes = append(changes, "Field Name changed from '"+existingDetails.FieldName+"' to '"+details.FieldName+"'")
	}

	if string(existingDetails.FieldValue) != string(details.FieldValue) {
		changes = append(changes, h.extractValueChanges(existingDetails.FieldValue, details.FieldValue)...)
	}

	for _, change := range changes {
		comments.WriteString(change)
		comments.WriteString(";\n")
	}

	return comments.String()
}

// UpdateAdditionalPropertyDetails handles PUT to update existing additional property details
func (h *AdditionalPropertyDetailsHandler) UpdateAdditionalPropertyDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidIdFormat, err.Error()))
		return
	}

	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}
	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	var req UpdateAdditionalPropertyDetailsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	// Convert interface{} to JSON bytes
	fieldValueBytes, err := json.Marshal(req.FieldValue)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid field value format", err.Error()))
		return
	}

	details := models.AdditionalPropertyDetails{
		ID:         id,
		FieldName:  req.FieldName,
		FieldValue: fieldValueBytes,
		PropertyID: req.PropertyID,
	}

	existingDetails, err := h.service.GetAdditionalPropertyDetailsByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to retrieve existing additional property details", err.Error()))
		return
	}

	if err := h.service.UpdateAdditionalPropertyDetails(c.Request.Context(), &details); err != nil {
		if err.Error() == "additional property details not found" {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody("Additional property details not found", err.Error()))
			return
		}
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to update additional property details", err.Error()))
		return
	}

	if isVerifying && existingDetails != nil {
		comments := h.buildChangeComments(existingDetails, &details)
		if err := h.logApplicationChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log assessment verification", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Additional property details updated successfully", details))
}

// DeleteAdditionalPropertyDetails handles DELETE by ID for additional property details
func (h *AdditionalPropertyDetailsHandler) DeleteAdditionalPropertyDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidIdFormat, err.Error()))
		return
	}

	if err := h.service.DeleteAdditionalPropertyDetails(c.Request.Context(), id); err != nil {
		if err.Error() == constants.ErrAdditionalPropertyDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrAdditionalPropertyDetailsNotFound))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody(constants.ErrInternalServer, err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Additional property details deleted successfully", nil))
}

// GetAllAdditionalPropertyDetails handles GET for all additional property details with pagination and filtering
func (h *AdditionalPropertyDetailsHandler) GetAllAdditionalPropertyDetails(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))

	var propertyID *uuid.UUID
	if propertyIDStr := c.Query("propertyId"); propertyIDStr != "" {
		if id, err := uuid.Parse(propertyIDStr); err == nil {
			propertyID = &id
		}
	}

	var fieldName *string
	if fieldNameStr := c.Query("fieldName"); fieldNameStr != "" {
		fieldName = &fieldNameStr
	}

	details, total, err := h.service.GetAllAdditionalPropertyDetails(c.Request.Context(), page, size, propertyID, fieldName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody(constants.ErrInternalServer, err.Error()))
		return
	}

	// Set pagination headers
	c.Header(constants.HeaderTotalCount, strconv.FormatInt(total, 10))
	c.Header(constants.HeaderCurrentPage, strconv.Itoa(page))
	c.Header(constants.HeaderPerPage, strconv.Itoa(size))
	c.Header(constants.HeaderTotalPages, strconv.Itoa((int((total + int64(size) - 1) / int64(size)))))

	c.JSON(http.StatusOK, details)
}

// GetAdditionalPropertyDetailsByPropertyID handles GET by property ID for additional property details
func (h *AdditionalPropertyDetailsHandler) GetAdditionalPropertyDetailsByPropertyID(c *gin.Context) {
	propertyIDStr := c.Param("propertyId")
	propertyID, err := uuid.Parse(propertyIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidPropertyID, err.Error()))
		return
	}

	details, err := h.service.GetAdditionalPropertyDetailsByPropertyID(c.Request.Context(), propertyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody(constants.ErrInternalServer, err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody(constants.MsgAdditionalPropertyDetailsRetrieved, details))
}

// GetAdditionalPropertyDetailsByFieldName handles GET by field name for additional property details
func (h *AdditionalPropertyDetailsHandler) GetAdditionalPropertyDetailsByFieldName(c *gin.Context) {
	fieldName := c.Param("fieldName")
	if fieldName == "" {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Field name is required", ""))
		return
	}

	details, err := h.service.GetAdditionalPropertyDetailsByFieldName(c.Request.Context(), fieldName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody(constants.ErrInternalServer, err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody(constants.MsgAdditionalPropertyDetailsRetrieved, details))
}

func (h *AdditionalPropertyDetailsHandler) logApplicationChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" || h.applicationLogService == nil {
		return nil
	}

	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_ADDITIONAL_DETAILS",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}

	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
