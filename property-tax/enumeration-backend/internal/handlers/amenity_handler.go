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
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// AmenityRequest represents the request body for creating/updating amenities
type AmenityRequest struct {
	PropertyID  string         `json:"property_id" binding:"required,uuid"`
	Type        pq.StringArray `gorm:"type:text[]" json:"type" binding:"required,dive"`
	Description string         `json:"description"`
	ExpiryDate  *time.Time     `json:"expiry_date"`
}

type AmenityHandler struct {
	service               services.AmenityService
	applicationLogService services.ApplicationLogService
}

func NewAmenityHandler(service services.AmenityService, applicationLogService services.ApplicationLogService) *AmenityHandler {
	return &AmenityHandler{service, applicationLogService}
}

const AmenitiesNotFoundMessage = "Amenity not found"

func (h *AmenityHandler) GetAll(c *gin.Context) {
	// Parse query parameters; service will enforce defaults/bounds
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	amenityType := c.Query("type")
	propertyID := c.Query("propertyId")

	var (
		amenities []models.Amenities
		total     int64
		err       error
	)

	// If no filters provided, call plain paginated GetAll; otherwise call filtered paginated method
	if amenityType == "" && propertyID == "" {
		amenities, total, err = h.service.GetAll(c.Request.Context(), page, size)
	} else {
		amenities, total, err = h.service.GetAllWithFilters(c.Request.Context(), page, size, amenityType, propertyID)
	}
	if err != nil {
		response.InternalServerError(c, "Failed to retrieve amenities: "+err.Error())
		return
	}

	// Calculate pagination meta (use the requested 'size' to compute pages; service has already clamped size)
	totalPages := int((total + int64(size) - 1) / int64(size))

	// Return paginated response
	response.Paginated(c, amenities, response.PaginationMeta{
		Page:       page,
		PageSize:   size,
		TotalItems: total,
		TotalPages: totalPages,
	})
}

func (h *AmenityHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	// Validate UUID format
	if _, err := uuid.Parse(id); err != nil {
		response.BadRequest(c, constants.ErrInvalidIdFormat)
		return
	}

	amenity, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		response.NotFound(c, AmenitiesNotFoundMessage)
		return
	}

	response.Success(c, "Amenity retrieved successfully", amenity)
}

func (h *AmenityHandler) Create(c *gin.Context) {
	var req AmenityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body: "+err.Error())
		return
	}

	// Parse property ID
	propertyUUID, err := uuid.Parse(req.PropertyID)
	if err != nil {
		response.BadRequest(c, constants.ErrInvalidPropertyID)
		return
	}

	// Create amenity model
	amenity := &models.Amenities{
		PropertyID:  propertyUUID,
		Type:        req.Type,
		Description: req.Description,
		ExpiryDate:  req.ExpiryDate,
	}

	if err := h.service.Create(c.Request.Context(), amenity); err != nil {
		response.InternalServerError(c, "Failed to create amenity: "+err.Error())
		return
	}

	response.Created(c, map[string]interface{}{
		"message": "Amenity created successfully",
		"data":    amenity,
	})
}

func (h *AmenityHandler) Update(c *gin.Context) {
	id := c.Param("id")

	// Validate UUID format
	if _, err := uuid.Parse(id); err != nil {
		response.BadRequest(c, constants.ErrInvalidIdFormat)
		return
	}

	var req AmenityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body: "+err.Error())
		return
	}

	// Parse property ID
	propertyUUID, err := uuid.Parse(req.PropertyID)
	if err != nil {
		response.BadRequest(c, constants.ErrInvalidPropertyID)
		return
	}

	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}
	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	// Create amenity model for update
	amenity := &models.Amenities{
		PropertyID:  propertyUUID,
		Type:        req.Type,
		Description: req.Description,
		ExpiryDate:  req.ExpiryDate,
	}

	existingAmenity, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		response.NotFound(c, AmenitiesNotFoundMessage)
		return
	}

	if err := h.service.Update(c.Request.Context(), id, amenity); err != nil {
		response.InternalServerError(c, "Failed to update amenity: "+err.Error())
		return
	}

	// Get updated amenity to return
	updatedAmenity, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		response.InternalServerError(c, "Failed to retrieve updated amenity")
		return
	}

	if isVerifying && existingAmenity != nil {
		comments := h.buildAmenityChangeComments(existingAmenity, amenity)
		if err := h.logAmenityChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log amenity verification", err.Error()))
			return
		}
	}

	response.Success(c, "Amenity updated successfully", updatedAmenity)
}

func (h *AmenityHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	// Validate UUID format
	if _, err := uuid.Parse(id); err != nil {
		response.BadRequest(c, constants.ErrInvalidIdFormat)
		return
	}

	// Check if amenity exists
	_, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		response.NotFound(c, AmenitiesNotFoundMessage)
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		response.InternalServerError(c, "Failed to delete amenity: "+err.Error())
		return
	}

	response.Success(c, "Amenity deleted successfully", nil)
}

func (h *AmenityHandler) GetByPropertyID(c *gin.Context) {
	propertyId := c.Param("propertyId")

	// Validate UUID format
	if _, err := uuid.Parse(propertyId); err != nil {
		response.BadRequest(c, constants.ErrInvalidPropertyID)
		return
	}

	amenities, err := h.service.GetByPropertyID(c.Request.Context(), propertyId)
	if err != nil {
		response.InternalServerError(c, "Failed to retrieve amenities by property ID: "+err.Error())
		return
	}

	response.Success(c, "Amenities retrieved successfully", amenities)
}

// buildAmenityFieldChanges builds change comments for amenity fields
func (h *AmenityHandler) buildAmenityFieldChanges(existing, updated *models.Amenities) []string {
	changes := []string{}

	if len(updated.Type) > 0 && !utils.CompareSlices(updated.Type, existing.Type) {
		changes = append(changes, "Amenity Type is changed from "+strings.Join(existing.Type, ", ")+" to "+strings.Join(updated.Type, ", "))
	}

	if len(updated.Description) > 0 && existing.Description != updated.Description {
		changes = append(changes, "Amenity Description is changed from "+existing.Description+" to "+updated.Description)
	}

	if updated.ExpiryDate != nil && existing.ExpiryDate != updated.ExpiryDate {
		dateChange := utils.FormatDateChange(existing.ExpiryDate, updated.ExpiryDate)
		changes = append(changes, "Amenity ExpiryDate is changed from "+dateChange)
	}

	return changes
}

// buildAmenityChangeComments constructs change comments from existing and updated amenity
func (h *AmenityHandler) buildAmenityChangeComments(existing, updated *models.Amenities) string {
	if existing == nil {
		return ""
	}

	changes := h.buildAmenityFieldChanges(existing, updated)
	if len(changes) == 0 {
		return ""
	}

	return strings.Join(changes, ";\n") + ";\n"
}

// logAmenityChange logs amenity update changes
func (h *AmenityHandler) logAmenityChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" || h.applicationLogService == nil {
		return nil
	}

	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_AMENITIES",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}

	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
