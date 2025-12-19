// Response structure for citizen property API
export interface CitizenPropertyResponse {
  success: boolean; // Indicates if the API call was successful
  message: string; // Response message
  data: CitizenPropertyData; // Main property data
}

// Main property data model for citizen view
export interface CitizenPropertyData {
  ID: string; // Unique property identifier
  PropertyNo: string; // Property number
  OwnershipType: string; // Type of ownership
  PropertyType: string; // Type/category of property
  ComplexName: string; // Name of the complex (if any)
  Address: PropertyAddress; // Address details
  AssessmentDetails: AssessmentDetails; // Assessment details
  Amenities: Amenities; // Amenities available
  ConstructionDetails: ConstructionDetails; // Construction details
  AdditionalDetails: AdditionalDetails; // Additional custom details
  GISData: GISData; // Geographic Information System data
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
  Documents: PropertyDocument[]; // Related documents
  IGRS: IGRSData; // IGRS (Integrated Grievance Redressal System) data
}

// Address details for a property
export interface PropertyAddress {
  ID: string; // Unique address identifier
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
}

// Assessment details for the property
export interface AssessmentDetails {
  ID: string; // Unique identifier
  ReasonOfCreation: string; // Reason for assessment creation
  OccupancyCertificateNumber: string; // Occupancy certificate number
  OccupancyCertificateDate: string; // Date of occupancy certificate
  ExtendOfSite: string; // Site area/extent
  IsLandUnderneathBuilding: boolean; // Whether land is underneath building
  IsUnspecifiedShare: boolean; // If property has unspecified share
  PropertyID: string; // Linked property ID
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Amenities available for the property
export interface Amenities {
  ID: string; // Unique identifier
  type: string[]; // Types of amenities
  Description: string; // Description of amenities
  ExpiryDate: string; // Expiry date for amenities
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
  FloorDetails: FloorDetail[]; // Details about each floor
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Details for each floor in the property
export interface FloorDetail {
  ID: string; // Unique floor identifier
  FloorNo: number; // Floor number
  Classification: string; // Classification of the floor
  NatureOfUsage: string; // Usage type (e.g., residential, commercial)
  FirmName: string; // Name of firm (if any)
  OccupancyType: string; // Type of occupancy
  OccupancyName: string; // Name of occupant
  constructionDate: string; // Date of construction
  effectiveFromDate: string; // Effective from date
  UnstructuredLand: string; // Unstructured land info
  LengthFt: number; // Length in feet
  BreadthFt: number; // Breadth in feet
  PlinthAreaSqFt: number; // Plinth area in sq ft
  BuildingPermissionNo: string; // Building permission number
  FloorDetailsEntered: boolean; // Whether floor details are entered
  ConstructionDetailsID: string; // Linked construction details ID
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Any additional custom details for the property
export interface AdditionalDetails {
  ID: string; // Unique identifier
  FieldName: string; // Name of the additional field
  fieldValue: {
    DocumentType: number; // Type of document
    revenueDocumentNo: number; // Revenue document number
    serialNo: number; // Serial number
  };
  PropertyID: string; // Linked property ID
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Geographic Information System (GIS) data for the property
export interface GISData {
  ID: string; // Unique GIS data identifier
  Source: string; // Source of GIS data
  Type: string; // Type of GIS data
  Latitude: number; // Latitude coordinate
  Longitude: number; // Longitude coordinate
  EntityType: string; // Type of entity (e.g., property)
  PropertyID: string; // Linked property ID
  Coordinates: Coordinate[]; // List of coordinates
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
}

// Single coordinate point for GIS data
export interface Coordinate {
  ID: string; // Unique coordinate identifier
  Latitude: number; // Latitude value
  Longitude: number; // Longitude value
  GISDataID: string; // Linked GIS data ID
  CreatedAt: string; // Creation timestamp
}

// Document associated with the property
export interface PropertyDocument {
  ID: string; // Unique document identifier
  PropertyID: string; // Linked property ID
  DocumentType: string; // Type of document
  DocumentName: string; // Name of the document
  FileStoreID: string; // File store identifier
  UploadDate: string; // Date of upload
  action: string; // Action performed (e.g., upload, delete)
}

// IGRS (Integrated Grievance Redressal System) data for the property
export interface IGRSData {
  id: string; // Unique IGRS data identifier
  habitation: string; // Habitation name
  igrsWard: string; // IGRS ward
  igrsLocality: string; // IGRS locality
  igrsBlock: string; // IGRS block
  doorNoFrom: string; // Door number (from)
  doorNoTo: string; // Door number (to)
  igrsClassification: string; // IGRS classification
  builtUpAreaPct: number; // Built-up area percentage
  frontSetback: number; // Front setback
  rearSetback: number; // Rear setback
  sideSetback: number; // Side setback
  totalPlinthArea: number; // Total plinth area
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
  PropertyID: string; // Linked property ID
}