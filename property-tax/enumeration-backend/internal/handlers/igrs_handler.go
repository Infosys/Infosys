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

// IGRSHandler handles HTTP requests for IGRS (Integrated Grievance Redressal System) resources.
type IGRSHandler struct {
	service               services.IGRSService // Service layer for IGRS operations
	applicationLogService services.ApplicationLogService
}

// NewIGRSHandler creates a new IGRSHandler with the provided service.
func NewIGRSHandler(s services.IGRSService, applicationLogService services.ApplicationLogService) *IGRSHandler {
	return &IGRSHandler{service: s, applicationLogService: applicationLogService}
}

// Create handles POST requests to create a new IGRS record.
// Validates the request body and delegates creation to the service layer.
func (h *IGRSHandler) Create(c *gin.Context) {
	var req dto.CreateIGRSRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": []string{err.Error()}})
		return
	}
	out, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create", "errors": []string{err.Error()}})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "IGRS created", "data": out})
}

// GetByID handles GET requests to retrieve an IGRS record by its ID.
func (h *IGRSHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidID, "errors": []string{err.Error()}})
		return
	}
	out, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Not found", "errors": []string{err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": out})
}

// Update handles PUT requests to update an existing IGRS record by its ID.
// Validates the request body and delegates update to the service layer.
func (h *IGRSHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidID, "errors": []string{err.Error()}})
		return
	}

	applicationId, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, response.ErrorResponseBody(constants.ErrInvalidApplicationID, err.Error()))
		return
	}
	isVerifying := c.DefaultQuery("isVerifying", "false") == "true"

	var req dto.UpdateIGRSRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": []string{err.Error()}})
		return
	}

	existingIGRS, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Not found", "errors": []string{err.Error()}})
		return
	}

	out, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update", "errors": []string{err.Error()}})
		return
	}

	if isVerifying && h.applicationLogService != nil && existingIGRS != nil {
		comments := h.buildIGRSChangeComments(existingIGRS, &req)
		if err := h.logIGRSChange(c, applicationId, comments); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to log IGRS verification", "errors": []string{err.Error()}})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Updated", "data": out})
}

func (h *IGRSHandler) buildIGRSChangeComments(existing *models.IGRS, updated *dto.UpdateIGRSRequest) string {
	changes := []string{}
	changes = append(changes, h.compareIGRSStringFields(existing, updated)...)
	changes = append(changes, h.compareIGRSFloatFields(existing, updated)...)
	if len(changes) == 0 {
		return ""
	}
	return strings.Join(changes, ";\n") + ";\n"
}

func (h *IGRSHandler) compareIGRSStringFields(existing *models.IGRS, updated *dto.UpdateIGRSRequest) []string {
	changes := []string{}
	stringFields := map[string]struct{ existing, updated string }{
		"IGRS Habitation":     {existing.Habitation, updated.Habitation},
		"IGRS Ward":           {existing.IGRSWard, updated.IGRSWard},
		"IGRS Locality":       {existing.IGRSLocality, updated.IGRSLocality},
		"IGRS Block":          {existing.IGRSBlock, updated.IGRSBlock},
		"IGRS DoorNoFrom":     {existing.DoorNoFrom, updated.DoorNoFrom},
		"IGRS DoorNoTo":       {existing.DoorNoTo, updated.DoorNoTo},
		"IGRS Classification": {existing.IGRSClassification, updated.IGRSClassification},
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

func (h *IGRSHandler) compareNullableFloat(fieldName string, existing, updated *float64) string {
	if updated == nil {
		return ""
	}
	if existing == nil {
		return fieldName + " is added as " + utils.FormatFloat(*updated)
	}
	if *existing != *updated {
		return fieldName + " is changed from " + utils.FormatFloat(*existing) + " to " + utils.FormatFloat(*updated)
	}
	return ""
}

func (h *IGRSHandler) compareIGRSFloatFields(existing *models.IGRS, updated *dto.UpdateIGRSRequest) []string {
	changes := []string{}
	fields := map[string]struct{ existing, updated *float64 }{
		"IGRS BuiltUpAreaPct":  {existing.BuiltUpAreaPct, updated.BuiltUpAreaPct},
		"IGRS FrontSetback":    {existing.FrontSetback, updated.FrontSetback},
		"IGRS RearSetback":     {existing.RearSetback, updated.RearSetback},
		"IGRS SideSetback":     {existing.SideSetback, updated.SideSetback},
		"IGRS TotalPlinthArea": {existing.TotalPlinthArea, updated.TotalPlinthArea},
	}
	for fieldName, values := range fields {
		if change := h.compareNullableFloat(fieldName, values.existing, values.updated); change != "" {
			changes = append(changes, change)
		}
	}
	return changes
}

// Delete handles DELETE requests to remove an IGRS record by its ID.
func (h *IGRSHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": constants.ErrInvalidID, "errors": []string{err.Error()}})
		return
	}
	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete", "errors": []string{err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Deleted"})
}

// List handles GET requests to retrieve a paginated list of IGRS records.
// Sets pagination headers and returns the result set.
func (h *IGRSHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "0"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	items, total, err := h.service.List(c.Request.Context(), page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to list", "errors": []string{err.Error()}})
		return
	}
	totalPages := int(total) / size
	if int(total)%size != 0 {
		totalPages++
	}
	c.Header("X-Total-Count", strconv.FormatInt(total, 10))
	c.Header("X-Current-Page", strconv.Itoa(page))
	c.Header("X-Per-Page", strconv.Itoa(size))
	c.Header("X-Total-Pages", strconv.Itoa(totalPages))
	c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
}

func (h *IGRSHandler) logIGRSChange(c *gin.Context, applicationID uuid.UUID, comments string) error {
	if comments == "" {
		return nil
	}
	userName, userRole := utils.GetUserInfoFromContext(c)
	appLogReq := &dto.CreateApplicationLogRequest{
		ApplicationID: applicationID,
		Action:        "EDIT_IGRS",
		Actor:         userRole,
		PerformedBy:   userName,
		Comments:      comments,
		Metadata:      map[string]interface{}{},
	}
	_, err := h.applicationLogService.Create(c.Request.Context(), appLogReq)
	return err
}
