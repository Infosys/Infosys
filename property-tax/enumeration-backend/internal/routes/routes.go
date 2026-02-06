// Package routes defines all API route registrations for the service
package routes

import (
	"enumeration/internal/handlers"
	"enumeration/internal/middleware"

	"github.com/gin-gonic/gin"
)

const (
	applicationsPath = "/v1/applications"
	propertyIDPath   = "/property/:propertyId"
	search           = "/search"
)

// HandlersConfig groups all handlers to avoid passing too many parameters
type HandlersConfig struct {
	Coordinates               *handlers.CoordinatesHandler
	FloorDetails              *handlers.FloorDetailsHandler
	ConstructionDetails       *handlers.ConstructionDetailsHandler
	AdditionalPropertyDetails *handlers.AdditionalPropertyDetailsHandler
	AssessmentDetails         *handlers.AssessmentDetailsHandler
	Property                  *handlers.PropertyHandler
	PropertyAddress           *handlers.PropertyAddressHandler
	GIS                       *handlers.GISHandler
	Application               *handlers.ApplicationHandler
	PropertyOwner             *handlers.PropertyOwnerHandler
	Amenity                   *handlers.AmenityHandler
	Document                  *handlers.DocumentHandler
	IGRS                      *handlers.IGRSHandler
	ApplicationLog            *handlers.ApplicationLogHandler
	GeoJSON                   *handlers.GeoJSONHandler
}

// SetupRoutes sets up all application routes
func SetupRoutes(router *gin.Engine, handlers *HandlersConfig) {
	v1 := router.Group("/v1", middleware.AuthMiddleware())
	{
		SetupCoordinatesRoutes(v1, handlers.Coordinates)
		SetupFloorDetailsRoutes(v1, handlers.FloorDetails)
		SetupApplicationRoutes(v1, handlers.Application)
		SetupPropertyOwnerRoutes(v1, handlers.PropertyOwner)
		SetupConstructionDetailsRoutes(v1, handlers.ConstructionDetails)
		SetupAdditionalPropertyDetailsRoutes(v1, handlers.AdditionalPropertyDetails)
		SetupAssessmentDetailsRoutes(v1, handlers.AssessmentDetails)
		SetupPropertyRoutes(v1, handlers.Property)
		SetupPropertyAddressRoutes(v1, handlers.PropertyAddress)
		SetupGISRoutes(v1, handlers.GIS)
		SetupAmenitiesRoutes(v1, handlers.Amenity)
		SetupDocumentsRoutes(v1, handlers.Document)
		SetupIGRSRoutes(v1, handlers.IGRS)
		SetupApplicationLogRoutes(v1, handlers.ApplicationLog)
		setupGeoJSONRoutes(v1, handlers.GeoJSON)
	}
}

func setupGeoJSONRoutes(router *gin.RouterGroup, handler *handlers.GeoJSONHandler) {
	geojson := router.Group("/geojson")
	{
		geojson.GET("/:id", handler.GetWardInfo)
	}
}

// RegisterApplicationLogRoutes registers all application log routes
func SetupApplicationLogRoutes(router *gin.RouterGroup, handler *handlers.ApplicationLogHandler) {
	v1 := router.Group("/application-logs")
	{
		// Application log endpoints
		v1.GET("", handler.GetApplicationLogs)
		v1.POST("", handler.CreateApplicationLog)
		v1.GET("/:id", handler.GetApplicationLogByID)
		v1.PUT("/:id", handler.UpdateApplicationLog)
		v1.DELETE("/:id", handler.DeleteApplicationLog)

		// Get logs by application ID
		v1.GET("/logs/:id", handler.GetApplicationLogsByApplicationID)
	}
}

// SetupApplicationRoutes registers routes for application endpoints
func SetupApplicationRoutes(router *gin.RouterGroup, applicationHandler *handlers.ApplicationHandler) {
	applications := router.Group("/applications", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		applications.GET("/:id", middleware.MDMSRoleMiddleware("GET", applicationsPath+"/:id"), applicationHandler.GetByID)
		applications.GET("", middleware.MDMSRoleMiddleware("GET", applicationsPath), applicationHandler.List)
		applications.GET(search, middleware.MDMSRoleMiddleware("GET", applicationsPath+search), applicationHandler.Search)
		applications.GET("/", middleware.MDMSRoleMiddleware("GET", applicationsPath+"/:applicationNo"), applicationHandler.GetByApplicationNo)

		applications.POST("", middleware.MDMSRoleMiddleware("POST", applicationsPath), applicationHandler.Create)

		applications.PUT("/:id", middleware.MDMSRoleMiddleware("PUT", applicationsPath+"/:id"), applicationHandler.Update)
		applications.PATCH("/:id", middleware.ActionMiddleware(), applicationHandler.Action)

		applications.DELETE("/:id", middleware.MDMSRoleMiddleware("DELETE", applicationsPath+"/:id"), applicationHandler.Delete)
	}
}

// SetupPropertyOwnerRoutes registers routes for property owner endpoints
func SetupPropertyOwnerRoutes(router *gin.RouterGroup, propertyOwnerHandler *handlers.PropertyOwnerHandler) {
	propertyOwners := router.Group("/property-owners", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		propertyOwners.POST("/:applicationId", propertyOwnerHandler.Create)      // POST /property-owners/{applicationId} - Create property owner
		propertyOwners.POST("/batch", propertyOwnerHandler.CreateBatch)          // POST /property-owners/batch - Create owners in batch
		propertyOwners.GET(propertyIDPath, propertyOwnerHandler.GetByPropertyID) // GET /property-owners/property/{propertyId}
		propertyOwners.PUT("/:id/:applicationId", propertyOwnerHandler.Update)   // PUT /property-owners/{id}/{applicationId} - Update property owner
		propertyOwners.DELETE("/:id/:applicationId", propertyOwnerHandler.Delete)               // DELETE /property-owners/{id}/{applicationId}
	}
}

// SetupConstructionDetailsRoutes registers routes for construction details endpoints
func SetupConstructionDetailsRoutes(router *gin.RouterGroup, constructionDetailsHandler *handlers.ConstructionDetailsHandler) {
	constructionDetails := router.Group("/construction-details", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		constructionDetails.POST("", constructionDetailsHandler.CreateConstructionDetails)
		constructionDetails.GET("", constructionDetailsHandler.GetAllConstructionDetails)
		constructionDetails.GET("/:id", constructionDetailsHandler.GetConstructionDetailsByID)
		constructionDetails.PUT("/:id/:applicationId", constructionDetailsHandler.UpdateConstructionDetails)
		constructionDetails.DELETE("/:id", constructionDetailsHandler.DeleteConstructionDetails)
		constructionDetails.GET(propertyIDPath, constructionDetailsHandler.GetConstructionDetailsByPropertyID)
	}
}

func SetupFloorDetailsRoutes(router *gin.RouterGroup, floorDetailsHandler *handlers.FloorDetailsHandler) {
	floorDetails := router.Group("/floor-details", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		floorDetails.POST("/:applicationId", floorDetailsHandler.CreateFloorDetails)
		floorDetails.GET("", floorDetailsHandler.GetAllFloorDetails)
		floorDetails.GET("/:id", floorDetailsHandler.GetFloorDetailsByID)
		floorDetails.PUT("/:id/:applicationId", floorDetailsHandler.UpdateFloorDetails)
		floorDetails.DELETE("/:id/:applicationId", floorDetailsHandler.DeleteFloorDetails)
	}
}

func SetupAdditionalPropertyDetailsRoutes(router *gin.RouterGroup, handler *handlers.AdditionalPropertyDetailsHandler) {
	additionalDetails := router.Group("/additional-property-details", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		additionalDetails.POST("", handler.CreateAdditionalPropertyDetails)
		additionalDetails.GET("", handler.GetAllAdditionalPropertyDetails)
		additionalDetails.GET("/:id", handler.GetAdditionalPropertyDetailsByID)
		additionalDetails.PUT("/:id/:applicationId", handler.UpdateAdditionalPropertyDetails)
		additionalDetails.DELETE("/:id", handler.DeleteAdditionalPropertyDetails)
		additionalDetails.GET(propertyIDPath, handler.GetAdditionalPropertyDetailsByPropertyID)
		additionalDetails.GET("/field/:fieldName", handler.GetAdditionalPropertyDetailsByFieldName)
	}
}

// SetupAssessmentDetailsRoutes registers routes for assessment details endpoints
func SetupAssessmentDetailsRoutes(router *gin.RouterGroup, assessmentDetailsHandler *handlers.AssessmentDetailsHandler) {
	assessmentDetails := router.Group("/assessment-details", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		assessmentDetails.POST("", assessmentDetailsHandler.CreateAssessmentDetails)
		assessmentDetails.GET("", assessmentDetailsHandler.GetAllAssessmentDetails)
		assessmentDetails.GET("/:id", assessmentDetailsHandler.GetAssessmentDetailsByID)
		assessmentDetails.PUT("/:id/:applicationId", assessmentDetailsHandler.UpdateAssessmentDetails)
		assessmentDetails.DELETE("/:id", assessmentDetailsHandler.DeleteAssessmentDetails)
		assessmentDetails.GET(propertyIDPath, assessmentDetailsHandler.GetAssessmentDetailsByPropertyID)
	}
}

// SetupPropertyRoutes registers routes for property endpoints
func SetupPropertyRoutes(router *gin.RouterGroup, propertyHandler *handlers.PropertyHandler) {
	properties := router.Group("/properties", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		properties.POST("", propertyHandler.CreateProperty)
		properties.GET("", propertyHandler.GetAllProperties)
		properties.GET(search, propertyHandler.SearchProperties)
		properties.GET("/:id", propertyHandler.GetPropertyByID)
		properties.PUT("/:id/:applicationId", propertyHandler.UpdateProperty)
		properties.DELETE("/:id", propertyHandler.DeleteProperty)
		properties.GET("/property-no/:propertyNo", propertyHandler.GetPropertyByPropertyNo)
	}
}

// SetupPropertyAddressRoutes registers routes for property address endpoints
func SetupPropertyAddressRoutes(router *gin.RouterGroup, propertyAddressHandler *handlers.PropertyAddressHandler) {
	propertyAddresses := router.Group("/property-addresses", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		propertyAddresses.POST("", propertyAddressHandler.CreatePropertyAddress)
		propertyAddresses.GET("", propertyAddressHandler.GetAllPropertyAddresses)
		propertyAddresses.GET(search, propertyAddressHandler.SearchPropertyAddresses)
		propertyAddresses.GET("/:id", propertyAddressHandler.GetPropertyAddressByID)
		propertyAddresses.PUT("/:id/:applicationId", propertyAddressHandler.UpdatePropertyAddress)
		propertyAddresses.DELETE("/:id", propertyAddressHandler.DeletePropertyAddress)
		propertyAddresses.GET(propertyIDPath, propertyAddressHandler.GetPropertyAddressByPropertyID)
	}
}

// SetupGISRoutes registers routes for GIS data endpoints
func SetupGISRoutes(router *gin.RouterGroup, gisHandler *handlers.GISHandler) {
	gisData := router.Group("/gis-data", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		gisData.GET("", gisHandler.GetAll)                      // GET /gis-data - Get all GIS data
		gisData.POST("", gisHandler.Create)                     // POST /gis-data - Create GIS data
		gisData.GET("/:id", gisHandler.GetByID)                 // GET /gis-data/{id} - Get GIS data by ID
		gisData.PUT("/:id", gisHandler.Update)                  // PUT /gis-data/{id} - Update GIS data
		gisData.DELETE("/:id", gisHandler.Delete)               // DELETE /gis-data/{id} - Delete GIS data
		gisData.GET(propertyIDPath, gisHandler.GetByPropertyID) // GET /gis-data/property/{propertyId} - Get GIS data by property ID
	}
}

// SetupCoordinatesRoutes sets up the routes for coordinates endpoints
func SetupCoordinatesRoutes(router *gin.RouterGroup, coordinatesHandler *handlers.CoordinatesHandler) {
	coordinates := router.Group("/coordinates", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		coordinates.GET("", coordinatesHandler.GetAll)        // GET /coordinates - Get all coordinates
		coordinates.POST("", coordinatesHandler.Create)       // POST /coordinates - Create coordinates
		coordinates.GET("/:id", coordinatesHandler.GetByID)   // GET /coordinates/{id} - Get coordinates by ID
		coordinates.PUT("/:id", coordinatesHandler.Update)    // PUT /coordinates/{id} - Update coordinates
		coordinates.DELETE("/:id", coordinatesHandler.Delete) // DELETE /coordinates/{id} - Delete coordinates
		coordinates.POST("/batch", coordinatesHandler.CreateBatch)
		coordinates.PUT("/gis/:gisDataId", coordinatesHandler.ReplaceByGISDataID)
	}
}

func SetupAmenitiesRoutes(router *gin.RouterGroup, amenityHandler *handlers.AmenityHandler) {
	amenities := router.Group("/amenities", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		amenities.GET("", amenityHandler.GetAll)
		amenities.POST("", amenityHandler.Create)
		amenities.GET("/:id", amenityHandler.GetByID)
		amenities.GET(propertyIDPath, amenityHandler.GetByPropertyID)
		amenities.PUT("/:id/:applicationId", amenityHandler.Update)
		amenities.DELETE("/:id", amenityHandler.Delete)
	}
}

// SetupDocumentsRoutes registers routes for document endpoints
func SetupDocumentsRoutes(router *gin.RouterGroup, handler *handlers.DocumentHandler) {
	docs := router.Group("/documents", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		docs.GET("", handler.GetAll)                      // GET /v1/documents
		docs.POST("", handler.CreateBatch)                // POST /v1/documents (accepts []Document)
		docs.GET("/:id", handler.GetByID)                 // GET /v1/documents/{id}
		docs.GET(propertyIDPath, handler.GetByPropertyID) // GET /v1/documents/property/{propertyId}
		docs.DELETE("/:id", handler.Delete)
		docs.PUT("/:id", handler.Update) // PUT /v1/documents/{id}
	}
}

func SetupIGRSRoutes(router *gin.RouterGroup, igrsHandler *handlers.IGRSHandler) {
	igrs := router.Group("/igrs", middleware.MDMSRoleMiddleware("POST", applicationsPath))
	{
		igrs.GET("", igrsHandler.List)
		igrs.POST("", igrsHandler.Create)
		igrs.GET("/:id", igrsHandler.GetByID)
		igrs.PUT("/:id/:applicationId", igrsHandler.Update)
		igrs.DELETE("/:id", igrsHandler.Delete)
	}
}
