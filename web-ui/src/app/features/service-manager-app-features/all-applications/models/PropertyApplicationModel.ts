// ---------- Utility ----------
export interface Location {
  lat: number;
  lng: number;
}

// ---------- Address ----------
export interface PropertyAddress {
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
  CorrespondenceAddress1: string;
  CorrespondenceAddress2: string;
  CorrespondenceAddress3: string;
}

// ---------- Assessment ----------
export interface AssessmentDetails {
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
}

// ---------- Amenities (MATCHES API STRUCTURE) ----------
export interface Amenities {
  ID: string;
  type: string[];          // Array of strings like ["Lift", "Electricity"]
  Description: string;
  ExpiryDate: string | null;
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// ---------- Construction / Floors ----------
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

// ---------- Additional Details ----------
export interface AdditionalDetails {
  ID: string;
  FieldName: string;
  fieldValue: {
    DocumentType?: number;
    revenueDocumentNo?: number;
    serialNo?: number;
    [key: string]: any;
  };
  PropertyID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// ---------- GIS ----------
export interface Coordinate {
  ID: string;
  Latitude: number;
  Longitude: number;
  GISDataID: string;
  CreatedAt: string;
}

export interface GISData {
  ID: string;
  Source: string;
  Type: string;
  EntityType: string;
  PropertyID: string;
  Latitude: number;
  Longitude: number;
  Coordinates: Coordinate[];
  CreatedAt: string;
  UpdatedAt: string;
}

// ---------- Documents ----------
export interface PropertyDocument {
  ID: string;
  PropertyID: string;
  DocumentType: string;
  DocumentName: string;
  FileStoreID: string;
  UploadDate: string;
  action: string;
}

// ---------- IGRS ----------
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

// ---------- Property ----------
export interface PropertyDetails {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  Address: PropertyAddress;
  AssessmentDetails: AssessmentDetails;
  Amenities: Amenities;                    // Single object, not array!
  ConstructionDetails: ConstructionDetails;
  AdditionalDetails: AdditionalDetails;
  GISData: GISData;
  CreatedAt: string;
  UpdatedAt: string;
  Documents: PropertyDocument[];
  IGRS: IGRS;
}

// ---------- Application ----------
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
  ApplicationLogs: any[] | null;
  IsDraft: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  AgentName?: string;
  AgentUsername?: string;
}