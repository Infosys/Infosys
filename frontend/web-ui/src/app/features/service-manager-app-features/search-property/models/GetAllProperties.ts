// This file defines TypeScript interfaces for property, application, and related data models
// used in the property search and management features.

// Represents details of a single floor in a property
export interface FloorDetail {
  ID: string;
  FloorNo: number;
  Classification: string;
  NatureOfUsage: string;
  FirmName: string;
  OccupancyType: string;
  OccupancyName: string;
  constructionDate: string;
  effectiveFromDate: string;
  UnstructuredLand: string;
  LengthFt: number;
  BreadthFt: number;
  PlinthAreaSqFt: number;
  BuildingPermissionNo: string;
  FloorDetailsEntered: boolean;
  ConstructionDetailsID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Represents construction details for a property, including all floors
export interface ConstructionDetails {
  ID: string;
  FloorType: string;
  WallType: string;
  RoofType: string;
  WoodType: string;
  PropertyID: string;
  FloorDetails: FloorDetail[];
  CreatedAt: string;
  UpdatedAt: string;
}

// Represents a single GIS coordinate (latitude/longitude)
export interface GISCoordinate {
  ID: string;
  Latitude: number;
  Longitude: number;
  GISDataID: string;
  CreatedAt: string;
}

// Represents GIS data for a property, including all coordinates
export interface GISData {
  ID: string;
  Source: string;
  Type: string;
  EntityType: string;
  PropertyID: string;
  Coordinates: GISCoordinate[];
  CreatedAt: string;
  UpdatedAt: string;
  Latitude: number;
  Longitude:number;
}

// Represents a document associated with a property
export interface Document {
  ID: string;
  PropertyID: string;
  DocumentType: string;
  DocumentName: string;
  FileStoreID: string | null;
  UploadDate: string;
}

// Represents the address details of a property
export interface Address {
  ID: string;
  Locality: string;
  ZoneNo: string;
  WardNo: string;
  BlockNo: string;
  Street: string;
  ElectionWard: string;
  SecretariatWard: string;
  PinCode: number;
  DifferentCorrespondenceAddress: boolean;
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Represents assessment details for a property
export interface AssessmentDetails {
  ID: string;
  PropertyID: string;
  ExtentOfSite: string;
  IsLandUnderneathBuilding: string;
  IsUnspecifiedShare: boolean;
  OccupancyCertificateDate: string;
  OccupancyCertificateNumber: string;
  ReasonOfCreation: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Represents an amenity available at a property
export interface Amenity {
  ID: string;
  Type: string;
  Description: string;
  ExpiryDate: string;
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Represents additional details for a property, including amenities, certifications, and security
export interface AdditionalDetails {
  ID: string;
  FieldName: string;
  fieldValue: {
    amenities: string[];
    certification: {
      earthquake_resistant: boolean;
      fire_safety: string;
      green_building: boolean;
    };
    construction_year: number;
    elevator: boolean;
    floors: number;
    security: {
      access_control: string;
      cctv: boolean;
      guard: string;
    };
    units_per_floor: number;
  };
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Represents all property details, including address, amenities, construction, and documents
export interface PropertyDetails {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  Address: Address | null;
  AssessmentDetails: AssessmentDetails | null;
  Amenities: Amenity[];
  ConstructionDetails: ConstructionDetails | null;
  AdditionalDetails: AdditionalDetails | null;
  GISData: GISData | null;
  CreatedAt: string;
  UpdatedAt: string;
  Documents: Document[];
}

// Represents a single property application (used in lists)
export interface AllApplicationModel {
  ID: string;
  ApplicationNo: string;
  PropertyID: string;
  Priority: string;
  TenantID: string;
  DueDate: string;
  AssignedAgent: string | null;
  Status: string;
  WorkflowInstanceID: string;
  AppliedBy: string;
  AssesseeID: string | null;
  Property: PropertyDetails;
  ApplicationLogs: any[];
  IsDraft: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

// Request structure for fetching all properties (with pagination)
export interface GetAllPropertiesRequest {
    page?: number;
    size?: number;
}

// Response structure for fetching all properties (with pagination and metadata)
export interface GetAllPropertiesResponse {
    data: AllApplicationModel[];
    message: string;
    pagination: {
        page: number;
        size: number;
        totalItems: number;
        totalPages: number;
    };
    success: boolean;
}
