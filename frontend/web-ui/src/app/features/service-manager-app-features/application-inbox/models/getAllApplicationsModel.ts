
/**
 * Represents an amenity associated with a property.
 */
export interface Amenity {
  ID: string;            // Unique amenity ID
  Type: string;          // Type of amenity
  Description: string;   // Description of the amenity
  ExpiryDate: string;    // Expiry date of the amenity
  PropertyID: string;    // Associated property ID
  CreatedAt: string;     // Creation timestamp
  UpdatedAt: string;     // Last update timestamp
}


/**
 * Represents details of a floor within a property.
 */
export interface FloorDetail {
  ID: string;                    // Unique floor detail ID
  FloorNo: number;               // Floor number
  Classification: string;        // Classification of the floor
  NatureOfUsage: string;         // Usage type (e.g., residential, commercial)
  FirmName: string;              // Name of the firm (if applicable)
  OccupancyType: string;         // Type of occupancy
  OccupancyName: string;         // Name of the occupant
  constructionDate: string;      // Construction date
  effectiveFromDate: string;     // Date from which the floor is effective
  UnstructuredLand: string;      // Unstructured land info
  LengthFt: number;              // Length in feet
  BreadthFt: number;             // Breadth in feet
  PlinthAreaSqFt: number;        // Plinth area in square feet
  BuildingPermissionNo: string;  // Building permission number
  FloorDetailsEntered: boolean;  // Whether floor details are entered
  ConstructionDetailsID: string; // Associated construction details ID
  CreatedAt: string;             // Creation timestamp
  UpdatedAt: string;             // Last update timestamp
}


/**
 * Represents construction details of a property.
 */
export interface ConstructionDetails {
  ID: string;                  // Unique construction details ID
  FloorType: string;           // Type of floor
  WallType: string;            // Type of wall
  RoofType: string;            // Type of roof
  WoodType: string;            // Type of wood used
  PropertyID: string;          // Associated property ID
  FloorDetails: FloorDetail[]; // List of floor details
  CreatedAt: string;           // Creation timestamp
  UpdatedAt: string;           // Last update timestamp
}


/**
 * Represents a GIS coordinate for a property.
 */
export interface GISCoordinate {
  ID: string;         // Unique coordinate ID
  Latitude: number;   // Latitude value
  Longitude: number;  // Longitude value
  GISDataID: string;  // Associated GIS data ID
  CreatedAt: string;  // Creation timestamp
}


/**
 * Represents GIS data for a property, including coordinates.
 */
export interface GISData {
  ID: string;                  // Unique GIS data ID
  Source: string;              // Source of GIS data
  Type: string;                // Type of GIS data
  EntityType: string;          // Entity type (e.g., property)
  PropertyID: string;          // Associated property ID
  Coordinates: GISCoordinate[];// List of coordinates
  CreatedAt: string;           // Creation timestamp
  UpdatedAt: string;           // Last update timestamp
}


/**
 * Represents a document associated with a property.
 */
export interface Document {
  ID: string;                // Unique document ID
  PropertyID: string;        // Associated property ID
  DocumentType: string;      // Type of document
  DocumentName: string;      // Name of the document
  FileStoreID: string | null;// File store identifier (nullable)
  UploadDate: string;        // Date the document was uploaded
}


/**
 * Represents the address details of a property.
 */
export interface Address {
  ID: string;                          // Unique address ID
  Locality: string;                    // Locality name
  ZoneNo: string;                      // Zone number
  WardNo: string;                      // Ward number
  BlockNo: string;                     // Block number
  Street: string;                      // Street name
  ElectionWard: string;                // Election ward
  SecretariatWard: string;             // Secretariat ward
  PinCode: number;                     // Postal code
  DifferentCorrespondenceAddress: boolean; // If correspondence address is different
  PropertyID: string;                  // Associated property ID
  CreatedAt: string;                   // Creation timestamp
  UpdatedAt: string;                   // Last update timestamp
}


/**
 * Represents assessment details for a property.
 */
export interface AssessmentDetails {
  ID: string;                        // Unique assessment ID
  PropertyID: string;                // Associated property ID
  ExtentOfSite: string;              // Extent of the site
  IsLandUnderneathBuilding: string;  // Whether land is underneath building
  IsUnspecifiedShare: boolean;       // If share is unspecified
  OccupancyCertificateDate: string;  // Date of occupancy certificate
  OccupancyCertificateNumber: string;// Occupancy certificate number
  ReasonOfCreation: string;          // Reason for creation
  CreatedAt: string;                 // Creation timestamp
  UpdatedAt: string;                 // Last update timestamp
}


/**
 * Represents additional details for a property, such as amenities and certifications.
 */
export interface AdditionalDetails {
  ID: string;                // Unique additional details ID
  FieldName: string;         // Name of the field
  fieldValue: {
    amenities: string[];     // List of amenities
    certification: {
      earthquake_resistant: boolean; // Earthquake resistance
      fire_safety: string;           // Fire safety info
      green_building: boolean;       // Green building status
    };
    construction_year: number;       // Year of construction
    elevator: boolean;               // Elevator availability
    floors: number;                  // Number of floors
    security: {
      access_control: string;        // Access control info
      cctv: boolean;                 // CCTV availability
      guard: string;                 // Guard info
    };
    units_per_floor: number;         // Units per floor
  };
  PropertyID: string;               // Associated property ID
  CreatedAt: string;                // Creation timestamp
  UpdatedAt: string;                // Last update timestamp
}


/**
 * Represents the main details of a property.
 */
export interface PropertyDetails {
  ID: string;                              // Unique property ID
  PropertyNo: string;                      // Property number
  OwnershipType: string;                   // Type of ownership
  PropertyType: string;                    // Type of property
  ComplexName: string;                     // Name of the complex
  Address: Address | null;                 // Address details
  AssessmentDetails: AssessmentDetails | null; // Assessment details
  Amenities: Amenity[];                    // List of amenities
  ConstructionDetails: ConstructionDetails | null; // Construction details
  AdditionalDetails: AdditionalDetails | null;     // Additional property details
  GISData: GISData | null;                 // GIS data
  CreatedAt: string;                       // Creation timestamp
  UpdatedAt: string;                       // Last update timestamp
  Documents: Document[];                   // List of documents
}


/**
 * Represents an application record for a property.
 */
export interface AllApplicationModel {
  ID: string;                    // Unique application ID
  ApplicationNo: string;         // Application number
  PropertyID: string;            // Associated property ID
  Priority: string;              // Priority level
  TenantID: string;              // Tenant ID
  DueDate: string;               // Due date for the application
  AssignedAgent: string | null;  // Assigned agent ID (nullable)
  Status: string;                // Application status
  WorkflowInstanceID: string;    // Workflow instance ID
  AppliedBy: string;             // Who applied
  AssesseeID: string | null;     // Assessee ID (nullable)
  Property: PropertyDetails;     // Property details
  ApplicationLogs: any[];        // Logs related to the application
  IsDraft: boolean;              // Whether the application is a draft
  CreatedAt: string;             // Creation timestamp
  UpdatedAt: string;             // Last update timestamp
  agentName?: string;            // (Optional) Agent's name
  agentUsername?: string;        // (Optional) Agent's username
}


/**
 * Request parameters for fetching all applications (pagination).
 */
export interface GetAllApplicationsRequest {
  page?: number; // Page number
  size?: number; // Page size
}


/**
 * Response structure for fetching all applications.
 */
export interface GetAllApplicationsResponse {
  data: AllApplicationModel[]; // List of application models
  message: string;             // Response message
  pagination: {
    page: number;            // Current page
    size: number;            // Page size
    totalItems: number;      // Total number of items
    totalPages: number;      // Total number of pages
  };
  success: boolean;           // Whether the request was successful
}