// Represents the address details of a property
export interface Address {
  ID: string; // Unique identifier for the address
  Locality: string; // Locality or neighborhood
  ZoneNo: string; // Zone number
  WardNo: string; // Ward number
  BlockNo: string; // Block number
  Street: string; // Street name
  ElectionWard: string; // Election ward
  SecretariatWard: string; // Secretariat ward
  PinCode: number; // Postal code
  DifferentCorrespondenceAddress: boolean; // If correspondence address is different
  PropertyID: string; // Linked property ID
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
  correspondenceAddress1: string; // Correspondence address line 1
  correspondenceAddress2: string; // Correspondence address line 2
  correspondenceAddress3: string; // Correspondence address line 3
}

// Details related to property assessment
export interface AssessmentDetails {
  ID: string; // Unique identifier
  ReasonOfCreation: string; // Reason for assessment creation
  OccupancyCertificateNumber: string; // Occupancy certificate number
  OccupancyCertificateDate: string; // Date of occupancy certificate
  ExtentOfSite: string; // Site area/extent
  IsLandUnderneathBuilding: string; // Whether land is underneath building
  IsUnspecifiedShare: boolean; // If property has unspecified share
  PropertyID: string; // Linked property ID
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Construction-related details of the property
export interface ConstructionDetails {
  ID: string; // Unique identifier
  FloorType: string; // Type of floor
  WallType: string; // Type of wall
  RoofType: string; // Type of roof
  WoodType: string; // Type of wood used
  PropertyID: string; // Linked property ID
  FloorDetails: any; // Details about each floor (structure may vary)
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Any additional custom details for the property
export interface AdditionalDetails {
  ID: string; // Unique identifier
  FieldName: string; // Name of the additional field
  fieldValue: any; // Value of the field
  PropertyID: string; // Linked property ID
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Main property data model
export interface PropertyData {
  ID: string; // Unique property identifier
  PropertyNo: string; // Property number
  OwnershipType: string; // Type of ownership
  PropertyType: string; // Type/category of property
  ComplexName: string; // Name of the complex (if any)
  Address: Address; // Address details
  AssessmentDetails: AssessmentDetails | null; // Assessment details
  Amenities: any; // Amenities available (structure may vary)
  ConstructionDetails: ConstructionDetails | null; // Construction details
  AdditionalDetails: AdditionalDetails | null; // Additional custom details
  GISData: any; // Geographic Information System data
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
  Documents: any; // Related documents
  IGRS: any; // Integrated Grievance Redressal System or similar
}

// Represents an application related to a property (e.g., assessment, mutation)
export interface ApplicationData {
  ID: string; // Unique application identifier
  ApplicationNo: string; // Application number
  PropertyID: string; // Linked property ID
  Priority: string; // Priority of the application
  TenantID: string; // Tenant or jurisdiction ID
  DueDate: string; // Due date for processing
  AssignedAgent: string; // Agent assigned to the application
  Status: string; // Current status
  WorkflowInstanceID: string; // Workflow instance identifier
  AppliedBy: string; // User who applied
  AssesseeID: string; // Assessee (taxpayer) ID
  Property: PropertyData; // Property details
  ApplicationLogs: any; // Logs related to the application
  IsDraft: boolean; // Whether the application is a draft
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Pagination information for paginated responses
export interface Pagination {
  page: number; // Current page number
  size: number; // Number of items per page
  totalItems: number; // Total number of items
  totalPages: number; // Total number of pages
}

// Response structure for property search API
export interface SearchPropertyResponse {
  data: ApplicationData[]; // List of application data
  message: string; // Response message
  pagination: Pagination; // Pagination info
  success: boolean; // Success status
}

// Parameters for searching properties
export interface SearchPropertyParams {
  zoneNo?: string; // Filter by zone number
  wardNo?: string; // Filter by ward number
  page?: number; // Page number for pagination
  size?: number; // Page size for pagination
  sortBy?: string; // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Sort order
}