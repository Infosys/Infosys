// This file defines TypeScript interfaces for Agent home page data models.
// Used for typing API responses, property details, and related entities.
//import type { GISDataResponse } from "../../../../redux/apis/gisApi";

export interface Amenity {
  ID: string;
  Type: string;
  Description: string;
  ExpiryDate: string;
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Details for each floor in a property
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

// Construction details for a property, including all floors
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

// GIS coordinate for mapping property location
export interface GISCoordinate {
  ID: string;
  Latitude: number;
  Longitude: number;
  GISDataID: string;
  CreatedAt: string;
}

// GIS data for a property, including coordinates
export interface GISData {
  ID: string;
  Source: string;
  Type: string;
  EntityType: string;
  PropertyID: string;
  Coordinates: GISCoordinate[];
  CreatedAt: string;
  UpdatedAt: string;
}

// Document metadata for property files
export interface Document {
  ID: string;
  PropertyID: string;
  DocumentType: string;
  DocumentName: string;
  FileStoreID: string | null;
  UploadDate: string;
}

// Suggestion for Address interface
// Address details for a property
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

// Assessment details for a property
export interface AssessmentDetails {
  ID: string;
  PropertyID: string;
  ExtendOfSite: string;
  IsLandUnderneathBuilding: boolean;
  IsUnspecifiedShare: boolean;
  OccupancyCertificateDate: string;
  OccupancyCertificateNumber: string;
  ReasonOfCreation: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Additional details for a property, including amenities and certifications
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

// Application data for property workflows
export interface Application {
  ID: string;
  ApplicationNo: string;
  PropertyID: string;
  Priority: string;
  TenantID: string;
  DueDate: string;
  AssignedAgent: string;
  Status: string;
  WorkflowInstanceID: string;
  AppliedBy: string;
  AssesseeID: string;
  Property: PropertyDetails;
  ApplicationLogs: any;
  IsDraft: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

// IGRS details for property registration
export interface IGRS {
  id: string;
  habitation: string;
  igrsWard: string;
  igrsLocality: string;
  igrsBlock: string;
  doorNoFrom: string;
  doorNoTo: string;
  igrsClassification: string;
  builtUpAreaPct: number;
  frontSetback: number;
  rearSetback: number;
  sideSetback: number;
  totalPlinthArea: number;
  createdAt: string;
  updatedAt: string;
  PropertyID: string;
}

// Main property details object, includes all related entities
export interface PropertyDetails {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  Address: Address | null;
  AssessmentDetails: AssessmentDetails | null;
  Amenities: Amenity | null;
  ConstructionDetails: ConstructionDetails | null;
  AdditionalDetails: AdditionalDetails | null;
  GISData:{
      ID: string;
      Source: string;
      Type: string;
      EntityType: string;
      PropertyID: string;
      Latitude: number;
      Longitude: number;
      Coordinates: Array<{
        ID: string;
        Latitude: number;
        Longitude: number;
        GISDataID: string;
        CreatedAt: string;
      }>;
      CreatedAt: string;
      UpdatedAt: string;
    }  | null;
  CreatedAt: string;
  UpdatedAt: string;
  Documents: Document[];
  IGRS: IGRS | null;
}

// Pagination info for paginated API responses
export interface PaginationInfo {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

// API response for Agent home page property list
export interface HomePageResponse {
  data: Application[];
  message: string;
  pagination: PaginationInfo;
  success: boolean;
}
