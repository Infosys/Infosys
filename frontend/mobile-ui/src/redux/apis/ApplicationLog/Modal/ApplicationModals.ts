// TypeScript models for application log and property management data

// Address details for a property
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

// Assessment details for a property
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

// Amenities details for a property
export type AmenitiesDetails = {
  ID: string;
  type: string[];
  Description: string;
  ExpiryDate: string | null;
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
};

// Construction details for a property
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

// Details for each floor in a property
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

// Additional property details (e.g., parking)
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

// GIS data for property location and coordinates
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

export type GISCoordinate = {
  ID: string;
  Latitude: number;
  Longitude: number;
  GISDataID: string;
  CreatedAt: string;
};

// Document details for property documents
export type DocumentDetails = {
  ID: string;
  PropertyID: string;
  DocumentType: string;
  DocumentName: string;
  FileStoreID: string;
  UploadDate: string;
  action: string;
};

// IGRS details for property
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

// Main property object aggregating all sections
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
};

// Application log entry for tracking actions
export type ApplicationLog = {
  ID: string;
  Action: string;
  Actor: string;
  ApplicationID: string;
  Comments: string;
  CreatedAt: string;
  FileStoreID: string | null;
  Metadata: string;
  PerformedBy: string;
  PerformedDate: string;
};

// Root application data object (includes property and logs)
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
};

// Full response shape for application API
export type ApplicationResponse = {
  data: ApplicationData;
  message: string;
  success: boolean;
};

// Request body for posting a new application log
export interface PostApplicationLogRequest {
  action: string;
  performedBy: string;
  comments: string;
  metadata?: object | null;
  fileStoreId?: string | null;
  applicationId: string;
}

// Response body for posting a new application log
export interface PostApplicationLogResponse {
  data: {
    ID: string;
    Action: string;
    PerformedBy: string;
    PerformedDate: string;
    Comments: string;
    Metadata: string;
    FileStoreID: string | null;
    ApplicationID: string;
    CreatedAt: string;
  };
  message: string;
  success: boolean;
}