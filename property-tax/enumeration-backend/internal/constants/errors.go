// Package constants holds error message constants for the service
package constants

// Error message constants for various failure scenarios
const (
	// Application Errors
	ErrApplicationNotFound                = "application not found"
	ErrApplicationAlreadyExists           = "application already exists"
	ErrApplicationInvalidStatus           = "invalid application status"
	ErrApplicationInvalidPriority         = "invalid application priority"
	ErrApplicationCreationFailed          = "failed to create application"
	ErrApplicationUpdateFailed            = "failed to update application"
	ErrApplicationDeletionFailed          = "failed to delete application"
	ErrInvalidRequestBody                 = "invalid request body"
	ErrInvalidRequestBodyFormat           = "Invalid request body"
	ErrApplicationCountFailed             = "failed to count applications"
	ErrApplicationGetFailed               = "failed to get applications"
	ErrRecordNotFound                     = "record not found"
	ErrApplicationLogNotFound             = "Application log not found"
	ErrMsgFailedToGetApplicationLog       = "failed to get application log: %w"
	ErrInvalidAssessmentDetailsID         = "invalid assessment details ID: cannot be nil"
	ErrInvalidAssessmentDetailsIDFormat   = "Invalid assessment details ID"
	ErrAssessmentDetailsNotFound          = "assessment details not found"
	ErrAssessmentDetailsNotFoundMsg       = "Assessment details not found"
	ErrFailedToGetAssessmentDetails       = "Failed to get assessment details"
	ErrInvalidConstructionDetailsID       = "invalid construction details ID: cannot be nil"
	ErrInvalidConstructionDetailsIDFormat = "Invalid construction details ID"
	ErrConstructionDetailsNotFound        = "construction details not found"
	ErrConstructionDetailsNotFoundMsg     = "Construction details not found"
	ErrFailedToGetConstructionDetails     = "Failed to get construction details"
	ErrInvalidFloorDetailsID              = "invalid floor details ID: cannot be nil"
	ErrInvalidFloorDetailsIDFormat        = "Invalid floor details ID"
	ErrFloorDetailsNotFound               = "Floor details not found"
	ErrInvalidPropertyIDNil               = "invalid property ID: cannot be nil"
	ErrPropertyDoesNotBelongToTenant      = "property does not belong to tenant"
	ErrInvalidPropertyAddressID           = "invalid property address ID: cannot be nil"

	// Workflow Errors
	ErrWorkflowProcessNotFound          = "workflow process not found - please ensure workflow is pre-created"
	ErrWorkflowInstanceCreationFailed   = "failed to create workflow instance"
	ErrWorkflowTransitionCreationFailed = "failed to create workflow transition"

	// Validation Errors
	ErrInvalidIdFormat = "Invalid ID format"
	ErrIdCannotBeEmpty = "Id cannot be empty"

	ErrInvalidApplicationID    = "invalid application ID format"
	ErrInvalidTenantID         = "invalid tenant ID"
	ErrInvalidCitizenID        = "invalid citizen ID"
	ErrMissingRequiredFields   = "missing required fields"
	ErrExceededMaxApplications = "exceeded maximum applications per citizen"
	ErrInvalidPropertyID       = "invalid property ID format"

	// Property Errors
	ErrPropertyNotFound                           = "property not found"
	ErrPropertyValidationFailed                   = "property validation failed"
	ErrInvalidPropertyIDFormat                    = "Invalid property ID"
	ErrAccessDeniedPropertyBelongsDifferentTenant = "Access denied: Property belongs to different tenant"

	// Property Address Errors
	ErrInvalidPropertyAddressIDFormat = "Invalid property address ID"
	ErrPropertyAddressNotFound        = "Property address not found"

	// Property Owner Errors
	ErrInvalidPropertyOwnerIDFormat = "Invalid property owner ID"

	// Coordinates Errors
	ErrCoordinatesNotFound          = "coordinates not found"
	ErrCoordinatesValidationFailed  = "coordinates validation failed"
	ErrInvalidLatitude              = "invalid latitude value"
	ErrInvalidLongitude             = "invalid longitude value"
	ErrInvalidGISDataID             = "invalid GIS data ID"
	ErrInvalidGISDataIDFormat       = "Invalid GIS data ID"
	ErrCoordinatesOutOfBounds       = "coordinates out of geographic bounds"
	ErrBatchValidationFailed        = "batch validation failed"
	ErrCoordinatesObjectNil         = "coordinates object cannot be nil"
	ErrGISDataNotFound              = "GIS data not found"
	ErrGISDataGetFailed             = "failed to get GIS data"
	ErrGISDataRetrievedSuccessfully = "GIS data retrieved successfully"
	ErrInvalidCoordinatesID         = "Invalid coordinates ID"
	ErrInvalidID                    = "Invalid id"

	// Additional Property Details Errors
	ErrAdditionalPropertyDetailsNotFound = "additional property details not found"

	// General Errors
	ErrInternalServer          = "internal server error"
	ErrUnauthorized            = "unauthorized access"
	ErrForbidden               = "forbidden access"
	ErrBadRequest              = "bad request"
	ErrInvalidRequestBodyLower = "invalid request body"
	ErrTenantIDHeaderRequired  = "X-Tenant-ID header is required"

	// Document Errors
	ErrInvalidDocumentIDFormat = "Invalid document ID"
)
