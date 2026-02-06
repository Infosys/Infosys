// Package handlers contains HTTP handler implementations for the property tax enumeration system.
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

// ConstructionDetailsHandler handles HTTP requests for construction details resources.
type ConstructionDetailsHandler struct {
	constructionDetailsService services.ConstructionDetailsService // Service layer for construction details operations
	applicationLogService      services.ApplicationLogService
}

// NewConstructionDetailsHandler creates a new ConstructionDetailsHandler with the provided service.
func NewConstructionDetailsHandler(constructionDetailsService services.ConstructionDetailsService, applicationLogService services.ApplicationLogService) *ConstructionDetailsHandler {
	return &ConstructionDetailsHandler{
		constructionDetailsService: constructionDetailsService,
		applicationLogService:      applicationLogService,
	}
}

// CreateConstructionDetails handles POST requests to create a new construction details record.
// Validates the request body and delegates creation to the service layer.
func (h *ConstructionDetailsHandler) CreateConstructionDetails(c *gin.Context) {
	var constructionDetails models.ConstructionDetails

	if err := c.ShouldBindJSON(&constructionDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	if err := h.constructionDetailsService.CreateConstructionDetails(c.Request.Context(), &constructionDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to create construction details", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, response.SuccessResponseBody("Construction details created successfully", constructionDetails))
}

// GetConstructionDetailsByID handles GET requests to retrieve construction details by their ID.
func (h *ConstructionDetailsHandler) GetConstructionDetailsByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidConstructionDetailsIDFormat, err.Error()))
		return
	}

	constructionDetails, err := h.constructionDetailsService.GetConstructionDetailsByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrConstructionDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrConstructionDetailsNotFoundMsg, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody(constants.ErrFailedToGetConstructionDetails, err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Construction details retrieved successfully", constructionDetails))
}

// UpdateConstructionDetails handles PUT requests to update existing construction details by their ID.
// Validates the request body and delegates update to the service layer.
func (h *ConstructionDetailsHandler) UpdateConstructionDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidConstructionDetailsIDFormat, err.Error()))
		return
	}

	var constructionDetails models.ConstructionDetails
	if err := c.ShouldBindJSON(&constructionDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}

	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	constructionDetails.ID = id

	existingDetails, err := h.constructionDetailsService.GetConstructionDetailsByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to retrieve existing construction details", err.Error()))
		return
	}

	if err := h.constructionDetailsService.UpdateConstructionDetails(c.Request.Context(), &constructionDetails); err != nil {
		if err.Error() == constants.ErrConstructionDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrConstructionDetailsNotFoundMsg, err.Error()))
			return
		}
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to update construction details", err.Error()))
		return
	}

	if isVerifying && existingDetails != nil {
		comments := h.buildConstructionChangeComments(existingDetails, &constructionDetails)
		if err := h.logConstructionChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log construction details verification", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Construction details updated successfully", constructionDetails))
}

// DeleteConstructionDetails handles DELETE requests to remove construction details by their ID.
func (h *ConstructionDetailsHandler) DeleteConstructionDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidConstructionDetailsIDFormat, err.Error()))
		return
	}

	if err := h.constructionDetailsService.DeleteConstructionDetails(c.Request.Context(), id); err != nil {
		if err.Error() == constants.ErrConstructionDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrConstructionDetailsNotFoundMsg, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to delete construction details", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Construction details deleted successfully", nil))
}

// GetAllConstructionDetails handles GET requests to retrieve all construction details with pagination.
// Optionally filters by property ID and sets pagination headers.
func (h *ConstructionDetailsHandler) GetAllConstructionDetails(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))

	var propertyID *uuid.UUID
	if propertyIDStr := c.Query("propertyId"); propertyIDStr != "" {
		if id, err := uuid.Parse(propertyIDStr); err == nil {
			propertyID = &id
		}
	}

	constructionDetails, total, err := h.constructionDetailsService.GetAllConstructionDetails(c.Request.Context(), page, size, propertyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get construction details", err.Error()))
		return
	}

	// Set pagination headers
	c.Header("X-Total-Count", strconv.FormatInt(total, 10))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))

	c.JSON(http.StatusOK, constructionDetails)
}

// GetConstructionDetailsByPropertyID handles GET requests to retrieve construction details by property ID.
func (h *ConstructionDetailsHandler) GetConstructionDetailsByPropertyID(c *gin.Context) {
	propertyIDStr := c.Param("propertyId")
	propertyID, err := uuid.Parse(propertyIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid property ID", err.Error()))
		return
	}

	constructionDetails, err := h.constructionDetailsService.GetConstructionDetailsByPropertyID(c.Request.Context(), propertyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get construction details", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Construction details retrieved successfully", constructionDetails))
}

// compareConstructionField compares a construction field and returns change message if different
func compareConstructionField(fieldName, existing, updated string) string {
	switch {
	case updated == "" || existing == updated:
		return ""
	case existing == "":
		return fieldName + " is added as " + updated
	default:
		return fieldName + " is changed from " + existing + " to " + updated
	}
}

// buildConstructionFieldChanges builds change comments for construction detail fields
func (h *ConstructionDetailsHandler) buildConstructionFieldChanges(existing, updated *models.ConstructionDetails) []string {
	changes := []string{}

	if change := compareConstructionField("Floor Type", existing.FloorType, updated.FloorType); change != "" {
		changes = append(changes, change)
	}
	if change := compareConstructionField("Roof Type", existing.RoofType, updated.RoofType); change != "" {
		changes = append(changes, change)
	}
	if change := compareConstructionField("Wall Type", existing.WallType, updated.WallType); change != "" {
		changes = append(changes, change)
	}
	if change := compareConstructionField("Wood Type", existing.WoodType, updated.WoodType); change != "" {
		changes = append(changes, change)
	}

	return changes
}

// buildConstructionChangeComments constructs change comments from existing and updated construction details
func (h *ConstructionDetailsHandler) buildConstructionChangeComments(existing, updated *models.ConstructionDetails) string {
	if existing == nil {
		return ""
	}

	changes := h.buildConstructionFieldChanges(existing, updated)
	if len(changes) == 0 {
		return ""
	}

	return strings.Join(changes, ";\n") + ";\n"
}

func (h *ConstructionDetailsHandler) logConstructionChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" || h.applicationLogService == nil {
		return nil
	}

	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_CONSTRUCTION_DETAILS",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}

	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
