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

const (
	dateFormat = "2006-01-02"
)

// FloorDetailsHandler handles HTTP requests for floor details resources.
type FloorDetailsHandler struct {
	floorDetailsService   services.FloorDetailsService // Service layer for floor details operations
	applicationLogService services.ApplicationLogService
}

// NewFloorDetailsHandler creates a new FloorDetailsHandler with the provided service.
func NewFloorDetailsHandler(floorDetailsService services.FloorDetailsService, applicationLogService services.ApplicationLogService) *FloorDetailsHandler {
	return &FloorDetailsHandler{
		floorDetailsService:   floorDetailsService,
		applicationLogService: applicationLogService,
	}
}

// CreateFloorDetails handles POST requests to create a new floor details record.
// Validates the request body and delegates creation to the service layer.
func (h *FloorDetailsHandler) CreateFloorDetails(c *gin.Context) {
	var floorDetails models.FloorDetails

	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"
	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&floorDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	if err := h.floorDetailsService.CreateFloorDetails(c.Request.Context(), &floorDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to create floor details", err.Error()))
		return
	}

	if isVerifying {
		comments := "New floor details created: Floor No " + strconv.Itoa(floorDetails.FloorNo) + ";\n"

		userName, userRole := utils.GetUserInfoFromContext(c)

		appLogReq := &dto.CreateApplicationLogRequest{
			ApplicationID: applicationId,
			Action:        "ADD_FLOOR_DETAILS",
			Actor:         userRole,
			PerformedBy:   userName,
			Comments:      comments,
			Metadata:      map[string]interface{}{},
		}

		if h.applicationLogService != nil {
			if _, err := h.applicationLogService.Create(c.Request.Context(), appLogReq); err != nil {
				c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log floor details creation", err.Error()))
				return
			}
		}
	}

	c.JSON(http.StatusCreated, response.SuccessResponseBody("Floor details created successfully", floorDetails))
}

// GetFloorDetailsByID handles GET requests to retrieve floor details by their ID.
func (h *FloorDetailsHandler) GetFloorDetailsByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidFloorDetailsIDFormat, err.Error()))
		return
	}

	floorDetails, err := h.floorDetailsService.GetFloorDetailsByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrFloorDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrFloorDetailsNotFound, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get floor details", err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Floor details retrieved successfully", floorDetails))
}

// UpdateFloorDetails handles PUT requests to update existing floor details by their ID.
// Validates the request body and delegates update to the service layer.
func (h *FloorDetailsHandler) UpdateFloorDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidFloorDetailsIDFormat, err.Error()))
		return
	}

	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}
	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	var floorDetails models.FloorDetails
	if err := c.ShouldBindJSON(&floorDetails); err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Invalid request body", err.Error()))
		return
	}

	existingFloorDetails, err := h.floorDetailsService.GetFloorDetailsByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == constants.ErrFloorDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrFloorDetailsNotFound, err.Error()))
			return
		}
	}

	floorDetails.ID = id

	if err := h.floorDetailsService.UpdateFloorDetails(c.Request.Context(), &floorDetails); err != nil {
		if err.Error() == constants.ErrFloorDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrFloorDetailsNotFound, err.Error()))
			return
		}
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody("Failed to update floor details", err.Error()))
		return
	}

	if isVerifying && h.applicationLogService != nil && existingFloorDetails != nil {
		comments := h.buildFloorChangeComments(existingFloorDetails, &floorDetails)
		if err := h.logFloorChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log floor details verification", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Floor details updated successfully", floorDetails))
}

func (h *FloorDetailsHandler) compareFloatFields(existing, updated *models.FloorDetails) []string {
	changes := []string{}
	if existing.BreadthFt != updated.BreadthFt {
		existingStr := utils.FormatFloat(existing.BreadthFt)
		updatedStr := utils.FormatFloat(updated.BreadthFt)
		changes = append(changes, "Breadth changed from "+existingStr+" to "+updatedStr)
	}
	if existing.LengthFt != updated.LengthFt {
		existingStr := utils.FormatFloat(existing.LengthFt)
		updatedStr := utils.FormatFloat(updated.LengthFt)
		changes = append(changes, "Length changed from "+existingStr+" to "+updatedStr)
	}
	if existing.PlinthAreaSqFt != updated.PlinthAreaSqFt {
		existingStr := utils.FormatFloat(existing.PlinthAreaSqFt)
		updatedStr := utils.FormatFloat(updated.PlinthAreaSqFt)
		changes = append(changes, "Plinth Area (Sq Ft) changed from "+existingStr+" to "+updatedStr)
	}
	return changes
}

func (h *FloorDetailsHandler) compareStringFields(existing, updated *models.FloorDetails) []string {
	changes := []string{}
	floorType := compareStringChange("Floor Type", existing.Classification, updated.Classification)
	if floorType != "" {
		changes = append(changes, floorType)
	}
	buildingPerm := compareStringChange("Building Permission No", existing.BuildingPermissionNo, updated.BuildingPermissionNo)
	if buildingPerm != "" {
		changes = append(changes, buildingPerm)
	}
	firmName := compareStringChange("Firm Name", existing.FirmName, updated.FirmName)
	if firmName != "" {
		changes = append(changes, firmName)
	}
	natureOfUsage := compareStringChange("Nature of Usage", existing.NatureOfUsage, updated.NatureOfUsage)
	if natureOfUsage != "" {
		changes = append(changes, natureOfUsage)
	}
	occupancyType := compareStringChange("Occupancy Type", existing.OccupancyType, updated.OccupancyType)
	if occupancyType != "" {
		changes = append(changes, occupancyType)
	}
	occupancyName := compareStringChange("Occupancy Name", existing.OccupancyName, updated.OccupancyName)
	if occupancyName != "" {
		changes = append(changes, occupancyName)
	}
	unstructuredLand := compareStringChange("Unstructured Land", existing.UnstructuredLand, updated.UnstructuredLand)
	if unstructuredLand != "" {
		changes = append(changes, unstructuredLand)
	}
	return changes
}

func (h *FloorDetailsHandler) compareOtherFields(existing, updated *models.FloorDetails) []string {
	changes := []string{}
	if existing.FloorDetailsEntered != updated.FloorDetailsEntered {
		changes = append(changes, "Floor Details Entered changed from "+strconv.FormatBool(existing.FloorDetailsEntered)+" to "+strconv.FormatBool(updated.FloorDetailsEntered))
	}
	if existing.FloorNo != updated.FloorNo {
		changes = append(changes, "Floor No changed from "+strconv.Itoa(existing.FloorNo)+" to "+strconv.Itoa(updated.FloorNo))
	}
	if updated.ConstructionDate != nil && !updated.ConstructionDate.Time.IsZero() {
		existingZero := existing.ConstructionDate == nil || existing.ConstructionDate.Time.IsZero()
		if existingZero {
			changes = append(changes, "Construction Date is added as "+updated.ConstructionDate.Time.Format(dateFormat))
		} else if !existing.ConstructionDate.Time.Equal(updated.ConstructionDate.Time) {
			changes = append(changes, "Construction Date changed from "+existing.ConstructionDate.Time.Format(dateFormat)+" to "+updated.ConstructionDate.Time.Format(dateFormat))
		}
	}
	if updated.EffectiveFromDate != nil && !updated.EffectiveFromDate.Time.IsZero() {
		existingZero := existing.EffectiveFromDate == nil || existing.EffectiveFromDate.Time.IsZero()
		if existingZero {
			changes = append(changes, "Effective From Date is added as "+updated.EffectiveFromDate.Time.Format(dateFormat))
		} else if !existing.EffectiveFromDate.Time.Equal(updated.EffectiveFromDate.Time) {
			changes = append(changes, "Effective From Date changed from "+existing.EffectiveFromDate.Time.Format(dateFormat)+" to "+updated.EffectiveFromDate.Time.Format(dateFormat))
		}
	}
	return changes
}

func compareStringChange(fieldName, existing, updated string) string {
	if existing == updated {
		return ""
	}
	if existing == "" {
		return fieldName + " is added as " + updated
	}
	return fieldName + " changed from " + existing + " to " + updated
}

func (h *FloorDetailsHandler) buildFloorFieldChanges(existing, updated *models.FloorDetails) []string {
	changes := []string{}
	changes = append(changes, h.compareFloatFields(existing, updated)...)
	changes = append(changes, h.compareStringFields(existing, updated)...)
	changes = append(changes, h.compareOtherFields(existing, updated)...)
	return changes
}

func (h *FloorDetailsHandler) buildFloorChangeComments(existing, updated *models.FloorDetails) string {
	changes := h.buildFloorFieldChanges(existing, updated)
	if len(changes) == 0 {
		return ""
	}
	return strings.Join(changes, ";\n") + ";\n"
}

// DeleteFloorDetails handles DELETE requests to remove floor details by their ID.
func (h *FloorDetailsHandler) DeleteFloorDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidFloorDetailsIDFormat, err.Error()))
		return
	}

	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"
	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}

	if err := h.floorDetailsService.DeleteFloorDetails(c.Request.Context(), id); err != nil {
		if err.Error() == constants.ErrFloorDetailsNotFound {
			c.JSON(http.StatusNotFound, response.ErrorResponseBody(constants.ErrFloorDetailsNotFound, err.Error()))
			return
		}
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to delete floor details", err.Error()))
		return
	}

	if isVerifying && h.applicationLogService != nil {
		comments := "Floor details with ID " + id.String() + " deleted;\n"
		userName, userRole := utils.GetUserInfoFromContext(c)
		appLogReq := &dto.CreateApplicationLogRequest{
			ApplicationID: applicationId,
			Action:        "DELETE_FLOOR_DETAILS",
			Actor:         userRole,
			PerformedBy:   userName,
			Comments:      comments,
			Metadata:      map[string]interface{}{},
		}
		if _, err := h.applicationLogService.Create(c.Request.Context(), appLogReq); err != nil {
			c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to log floor details deletion", err.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, response.SuccessResponseBody("Floor details deleted successfully", nil))
}

// GetAllFloorDetails handles GET requests to retrieve all floor details with pagination.
// Optionally filters by construction details ID and sets pagination headers.
func (h *FloorDetailsHandler) GetAllFloorDetails(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))

	var constructionDetailsID *uuid.UUID
	if constructionDetailsIDStr := c.Query("constructionDetailsId"); constructionDetailsIDStr != "" {
		if id, err := uuid.Parse(constructionDetailsIDStr); err == nil {
			constructionDetailsID = &id
		}
	}

	floorDetails, total, err := h.floorDetailsService.GetAllFloorDetails(c.Request.Context(), page, size, constructionDetailsID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.ErrorResponseBody("Failed to get floor details", err.Error()))
		return
	}

	// Set pagination headers
	c.Header("X-Total-Count", strconv.FormatInt(total, 10))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))

	c.JSON(http.StatusOK, floorDetails)
}

func (h *FloorDetailsHandler) logFloorChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" || h.applicationLogService == nil {
		return nil
	}

	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_FLOOR_DETAILS",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}

	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
