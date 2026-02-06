// Package handlers contains HTTP handler implementations for the property tax enumeration system.
package handlers

import (
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
	"gorm.io/gorm"
)

// AssessmentDetailsHandler handles HTTP requests for assessment details resources.
type AssessmentDetailsHandler struct {
	assessmentDetailsService services.AssessmentDetailsService // Service layer for assessment details operations
	applicationLogService    services.ApplicationLogService
}

// NewAssessmentDetailsHandler creates a new AssessmentDetailsHandler with the provided service.
func NewAssessmentDetailsHandler(assessmentDetailsService services.AssessmentDetailsService, applicationLogService services.ApplicationLogService) *AssessmentDetailsHandler {
	return &AssessmentDetailsHandler{
		assessmentDetailsService: assessmentDetailsService,
		applicationLogService:    applicationLogService,
	}
}

// CreateAssessmentDetails handles POST requests to create a new assessment details record.
// Validates the request body and delegates creation to the service layer.
func (h *AssessmentDetailsHandler) CreateAssessmentDetails(c *gin.Context) {
	var assessmentDetails models.AssessmentDetails

	if err := c.ShouldBindJSON(&assessmentDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	if err := h.assessmentDetailsService.CreateAssessmentDetails(c.Request.Context(), &assessmentDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to create assessment details", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, response.SuccessResponseBody("Assessment details created successfully", assessmentDetails))
}

// GetAssessmentDetailsByID handles GET requests to retrieve assessment details by their ID.
func (h *AssessmentDetailsHandler) GetAssessmentDetailsByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidAssessmentDetailsIDFormat, err.Error()))
		return
	}

	assessmentDetails, err := h.assessmentDetailsService.GetAssessmentDetailsByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrAssessmentDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrAssessmentDetailsNotFoundMsg, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody(constants.ErrFailedToGetAssessmentDetails, err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Assessment details retrieved successfully", assessmentDetails))
}

// UpdateAssessmentDetails handles PUT requests to update existing assessment details by their ID.
// Validates the request body and delegates update to the service layer.
func (h *AssessmentDetailsHandler) UpdateAssessmentDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidAssessmentDetailsIDFormat, err.Error()))
		return
	}

	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}
	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	var assessmentDetails models.AssessmentDetails
	if err := c.ShouldBindJSON(&assessmentDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	existingAssessmentDetails, err := h.assessmentDetailsService.GetAssessmentDetailsByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrAssessmentDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrAssessmentDetailsNotFoundMsg, err.Error()))
			return
		}
	}

	assessmentDetails.ID = id

	if err := h.assessmentDetailsService.UpdateAssessmentDetails(c.Request.Context(), &assessmentDetails); err != nil {
		if err.Error() == constants.ErrAssessmentDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrAssessmentDetailsNotFoundMsg, err.Error()))
			return
		}
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to update assessment details", err.Error()))
		return
	}

	if isVerifying && existingAssessmentDetails != nil {
		comments := h.buildAssessmentChangeComments(existingAssessmentDetails, &assessmentDetails)
		if err := h.logAssessmentChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log assessment verification", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Assessment details updated successfully", assessmentDetails))
}

// DeleteAssessmentDetails handles DELETE requests to remove assessment details by their ID.
func (h *AssessmentDetailsHandler) DeleteAssessmentDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidAssessmentDetailsIDFormat, err.Error()))
		return
	}

	if err := h.assessmentDetailsService.DeleteAssessmentDetails(c.Request.Context(), id); err != nil {
		if err.Error() == constants.ErrAssessmentDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrAssessmentDetailsNotFoundMsg, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to delete assessment details", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Assessment details deleted successfully", nil))
}

// GetAllAssessmentDetails handles GET requests to retrieve all assessment details with pagination.
// Optionally filters by property ID and sets pagination headers.
func (h *AssessmentDetailsHandler) GetAllAssessmentDetails(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))

	var propertyID *uuid.UUID
	if propertyIDStr := c.Query("propertyId"); propertyIDStr != "" {
		if id, err := uuid.Parse(propertyIDStr); err == nil {
			propertyID = &id
		}
	}

	assessmentDetails, total, err := h.assessmentDetailsService.GetAllAssessmentDetails(c.Request.Context(), page, size, propertyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get assessment details", err.Error()))
		return
	}

	// Set pagination headers
	c.Header("X-Total-Count", strconv.FormatInt(total, 10))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))

	c.JSON(http.StatusOK, assessmentDetails)
}

// GetAssessmentDetailsByPropertyID handles GET requests to retrieve assessment details by property ID.
func (h *AssessmentDetailsHandler) GetAssessmentDetailsByPropertyID(c *gin.Context) {
	propertyIDStr := c.Param("propertyId")
	propertyID, err := uuid.Parse(propertyIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid property ID", err.Error()))
		return
	}

	assessmentDetails, err := h.assessmentDetailsService.GetAssessmentDetailsByPropertyID(c.Request.Context(), propertyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody("Assessment details not found for this property", err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get assessment details", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Assessment details retrieved successfully", assessmentDetails))
}

// compareAssessmentStringField compares string fields and returns change message if different
func compareAssessmentStringField(fieldName, existing, new string) string {
	if new == "" || existing == new {
		return ""
	}
	if existing == "" {
		return "Assessment Details " + fieldName + " is added as " + new
	}
	return "Assessment Details " + fieldName + " is changed from " + existing + " to " + new
}

// buildAssessmentFieldChanges builds change comments for assessment detail fields
func (h *AssessmentDetailsHandler) buildAssessmentFieldChanges(existing, updated *models.AssessmentDetails) []string {
	changes := []string{}

	if change := compareAssessmentStringField("Reason of Creation", existing.ReasonOfCreation, updated.ReasonOfCreation); change != "" {
		changes = append(changes, change)
	}
	if change := compareAssessmentStringField("Extent of Site", existing.ExtentOfSite, updated.ExtentOfSite); change != "" {
		changes = append(changes, change)
	}
	if change := compareAssessmentStringField("Is Land Underneath Building", existing.IsLandUnderneathBuilding, updated.IsLandUnderneathBuilding); change != "" {
		changes = append(changes, change)
	}
	if change := compareAssessmentStringField("Occupancy Certificate Number", existing.OccupancyCertificateNumber, updated.OccupancyCertificateNumber); change != "" {
		changes = append(changes, change)
	}

	if existing.IsUnspecifiedShare != updated.IsUnspecifiedShare {
		changes = append(changes, "Assessment Details Is Unspecified Share is changed from "+strconv.FormatBool(existing.IsUnspecifiedShare)+" to "+strconv.FormatBool(updated.IsUnspecifiedShare))
	}

	// Occupancy Certificate Date
	if updated.OccupancyCertificateDate != nil && !updated.OccupancyCertificateDate.Time.IsZero() {
		newDateStr := updated.OccupancyCertificateDate.Time.Format("2006-01-02")
		existingIsEmpty := existing.OccupancyCertificateDate == nil || existing.OccupancyCertificateDate.Time.IsZero()
		dateChanged := existingIsEmpty || !existing.OccupancyCertificateDate.Time.Equal(updated.OccupancyCertificateDate.Time)

		switch {
		case !dateChanged:
			// No change
		case existingIsEmpty:
			// Date was added
			changes = append(changes, "Assessment Details Occupancy CertificateDate is added as "+newDateStr)
		default:
			// Date was changed
			existingDateStr := existing.OccupancyCertificateDate.Time.Format("2006-01-02")
			changes = append(changes, "Assessment Details Occupancy CertificateDate is changed from "+existingDateStr+" to "+newDateStr)
		}
	}

	return changes
}

// buildAssessmentChangeComments constructs change comments from existing and updated assessment details
func (h *AssessmentDetailsHandler) buildAssessmentChangeComments(existing, updated *models.AssessmentDetails) string {
	if existing == nil {
		return ""
	}

	changes := h.buildAssessmentFieldChanges(existing, updated)
	if len(changes) == 0 {
		return ""
	}

	return strings.Join(changes, ";\n") + ";\n"
}

func (h *AssessmentDetailsHandler) logAssessmentChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" || h.applicationLogService == nil {
		return nil
	}

	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_ASSESSMENT_DETAILS",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}

	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
