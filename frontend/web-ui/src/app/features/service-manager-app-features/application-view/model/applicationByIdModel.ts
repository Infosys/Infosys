
// This file defines strict TypeScript models for the property management application.
// Each type represents a section of the property or application data as returned by the backend.

// Address section: represents the address details of a property
export type AddressDetails = {
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
  CororespondenceAddress1: string;
  CororespondenceAddress2: string;
  CororespondenceAddress3: string;
};

// Assessment details: property assessment and certification info
export type AssessmentDetails = {
  ID: string;
  ReasonOfCreation: string;
  OccupancyCertificateNumber: string;
  OccupancyCertificateDate: string;
  ExtentOfSite: string;
  IsLandUnderneathBuilding: string;
  IsUnspecifiedShare: boolean;
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
};

// Amenities section: property amenities and features
export type AmenitiesDetails = {
  ID: string;
  type: string[];
  Description: string;
  ExpiryDate: string | null;
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
};

// Construction section: construction details and floor breakdown
export type ConstructionDetails = {
  ID: string;
  FloorType: string;
  WallType: string;
  RoofType: string;
  WoodType: string;
  PropertyID: string;
  FloorDetails: FloorDetails[]; // see below
  CreatedAt: string;
  UpdatedAt: string;
};

// Individual floor details: details for each floor in the property
export type FloorDetails = {
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
};

// Additional property details, like parking or custom fields
export type AdditionalDetails = {
  ID: string;
  FieldName: string;
  fieldValue: {
    covered: boolean;
    monthly_fee: number;
    reserved_spaces: number;
    spaces: number;
    type: string;
    [key: string]: string | number | boolean | undefined;
  };
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
};

// GIS Data for property location: geospatial info and coordinates
export type GISData = {
  ID: string;
  Source: string;
  Type: string;
  EntityType: string;
  PropertyID: string;
  Latitude: number;
  Longitude: number;
  Coordinates: GISCoordinate[];
  CreatedAt: string;
  UpdatedAt: string;
};

// Individual GIS coordinate (for polygons, etc.)
export type GISCoordinate = {
  ID: string;
  Latitude: number;
  Longitude: number;
  GISDataID: string;
  CreatedAt: string;
};

// Document details: property document metadata
export type DocumentDetails = {
  ID: string;
  PropertyID: string;
  DocumentType: string;
  DocumentName: string;
  FileStoreID: string;
  UploadDate: string;
  action: string;
};

// IGRS section: registration and legal details
export type IGRSDetails = {
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
};

// Main property object with all sections referenced
export type Property = {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  Address: AddressDetails;
  AssessmentDetails: AssessmentDetails;
  Amenities: AmenitiesDetails;
  ConstructionDetails: ConstructionDetails;
  AdditionalDetails: AdditionalDetails;
  GISData: GISData;
  Documents: DocumentDetails[];
  IGRS: IGRSDetails;
  CreatedAt: string;
  UpdatedAt: string;
  typeOfLand: string;
  noOfFloors: number;
  noOfBasements?: number;
  hasMezzanineFloor?: boolean;
  noOfBuildings: number;
  buildingName?: string;

};

// Application log for history/tracking: records actions taken on the application
export type ApplicationLog = {
  ID: string;
  Actor: string;
  Action: string;
  PerformedBy: string;
  PerformedDate: string;
  Comments: string;
  Metadata: string;
  FileStoreID: string | null;
  ApplicationID: string;
  CreatedAt: string;
};

// The root application data object: represents a full property application
export type ApplicationData = {
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
  Property: Property;
  ApplicationLogs: ApplicationLog[];
  IsDraft: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  importantNote: string;
};

// Full response shape from your backend for a property application
export type ApplicationResponse = {
  data: ApplicationData;
  message: string;
  success: boolean;
};