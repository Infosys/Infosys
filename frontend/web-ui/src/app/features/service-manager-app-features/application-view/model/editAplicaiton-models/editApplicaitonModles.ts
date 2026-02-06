// Represents the value object for additional property details fields
export type AdditionalDetailsFieldValue = {
  spaces?: number; // Number of spaces (e.g., parking)
  covered?: boolean; // Whether the space is covered
  type?: string; // Type of detail (e.g., amenity type)
  monthly_fee?: number; // Monthly fee for the amenity
  reserved_spaces?: number; // Number of reserved spaces
  [key: string]: string | number | boolean | undefined; // Allow additional dynamic fields
};


// Request payload for editing additional property details
export interface EditAdditionalDetailsRequest {
  fieldName: string; // Name of the additional detail field
  fieldValue: AdditionalDetailsFieldValue;  // Value object for the field
  propertyId: string; // Associated property ID
}

// Response payload for editing additional property details
export interface EditAdditionalDetailsResponse {
  success: boolean;
  message: string;
  data: {
    ID: string;
    FieldName: string;
    fieldValue: AdditionalDetailsFieldValue;
    PropertyID: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
}

// --- Amenities ---
// Request payload for editing property amenities
export interface EditAmenitiesRequest {
  property_id: string; // Property ID
  type: string[]; // List of amenity types
}

// Response payload for editing property amenities
export interface EditAmenitiesResponse {
  success: boolean;
  message: string;
  data: {
    ID: string;
    type: string[];
    Description?: string;
    ExpiryDate?: string | null;
    PropertyID: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
}

// --- Owner Models ---
// Request payload for editing owner details
export interface EditOwnerRequest {
  name: string;
  contactNo: string;
  email: string;
  gender: string;
  guardian: string;
  guardianType: string;
  relationshipToProperty: string;
  ownershipShare: number;
  isPrimaryOwner: boolean;
  propertyId: string;
  AdhaarNo: number;
}

// Response payload for editing owner details
export interface EditOwnerResponse {
  success: boolean;
  message: string;
  data: {
    ID: string;
    Name: string;
    ContactNo: string;
    Email: string;
    Gender: string;
    Guardian: string;
    GuardianType: string;
    RelationshipToProperty: string;
    OwnershipShare: number;
    IsPrimaryOwner: boolean;
    PropertyID: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
}

// --- Assessment Models ---
// Request payload for editing property assessment details
export interface EditAssessmentRequest {
  ReasonOfCreation: string;
  OccupancyCertificateNumber: string;
  OccupancyCertificateDate: string;
  ExtentOfSite: string;
  IsLandUnderneathBuilding: string;
  IsUnspecifiedShare: boolean;
  PropertyID: string;
}

// Response payload for editing property assessment details
export interface EditAssessmentResponse {
  success: boolean;
  message: string;
  data: {
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
}

// --- IGRS Models ---
// Request payload for editing IGRS (registration) details
export interface EditIGRSRequest {
  propertyId: string;
  habitation: string;
  igrsWard: string;
  igrsLocality: string;
  igrsBlock?: string;
  doorNoFrom?: string;
  doorNoTo?: string;
  igrsClassification?: string;
  builtUpAreaPct: number;
  frontSetback?: number;
  rearSetback?: number;
  sideSetback?: number;
  totalPlinthArea: number;
}

// Response payload for editing IGRS details
export interface EditIGRSResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    habitation: string;
    igrsWard: string;
    igrsLocality: string;
    igrsBlock?: string;
    doorNoFrom?: string;
    doorNoTo?: string;
    igrsClassification?: string;
    builtUpAreaPct: number;
    frontSetback?: number;
    rearSetback?: number;
    sideSetback?: number;
    totalPlinthArea: number;
    createdAt: string;
    updatedAt: string;
    PropertyID: string;
  };
}

// --- Construction Models ---
// Request payload for editing construction details
export interface EditConstructionRequest {
  floorType: string;
  wallType: string;
  roofType: string;
  woodType: string;
  propertyId: string;
}

// Response payload for editing construction details
export interface EditConstructionResponse {
  success: boolean;
  message: string;
  data: {
    ID: string;
    FloorType: string;
    WallType: string;
    RoofType: string;
    WoodType: string;
    PropertyID: string;
    FloorDetails?: any; // Can be expanded with full model if needed
    CreatedAt: string;
    UpdatedAt: string;
  };
}

// --- Floor Models ---
// Request payload for editing floor details
export interface EditFloorRequest {
  FloorNo: number;
  Classification: string;
  NatureOfUsage: string;
  FirmName: string;
  OccupancyType: string;
  OccupancyName: string;
  ConstructionDate: string;
  EffectiveFromDate: string;
  UnstructuredLand: string;
  LengthFt: number;
  BreadthFt: number;
  PlinthAreaSqFt: number;
  BuildingPermissionNo: string;
  FloorDetailsEntered: boolean;
  ConstructionDetailsID: string;
  propertyId?: string;
}

// Request payload for editing address details
export interface EditAddressRequest {
  locality: string;
  zoneNo: string;
  wardNo: string;
  blockNo: string;
  street: string;
  electionWard: string;
  secretariatWard: string;
  PinCode: number;
  differentCorrespondenceAddress: boolean;
  propertyId: string;
  correspondenceAddress1: string;
  correspondenceAddress2: string;
  correspondencePincode: number;
}

// Response payload for editing address details
export interface EditAddressResponse {
  success: boolean;
  message: string;
  data: {
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
    correspondenceAddress1: string;
    correspondenceAddress2: string;
    correspondenceAddress3: string;
  };
}

// Response payload for editing floor details
export interface EditFloorResponse {
  success: boolean;
  message: string;
  data: {
    ID: string;
    floorNo: number;
    classification: string;
    natureOfUsage: string;
    firmName: string;
    occupancyType: string;
    occupancyName: string;
    constructionDate: string;
    effectiveFromDate: string;
    unstructuredLand: string;
    lengthFt: number;
    breadthFt: number;
    plinthAreaSqFt: number;
    buildingPermissionNo: string;
    floorDetailsEntered: boolean;
    constructionDetailsID: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
}