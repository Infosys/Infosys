// Model definitions for Citizen homepage application search API response.
// Each interface represents a part of the response structure for property applications.
// Used by CitizenHomePageApi to type API data and enable type-safe access in components.
//
// Top-level response from /v1/applications/search?assesseeId=...&isDraft=...
export interface CitizenApplicationSearchResponse {
  data: CitizenApplicationSummary[];
  message: string;
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
  success: boolean;
}

// Application summary for each property application returned in the data array
export interface CitizenApplicationSummary {
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
  Property: CitizenPropertySummary;
  ApplicationLogs: any;
  IsDraft: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

// Property details nested within each application summary
export interface CitizenPropertySummary {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  Address: CitizenPropertyAddress;
  AssessmentDetails: any;
  Amenities: any[];
  ConstructionDetails: any;
  AdditionalDetails: any;
  GISData: any;
  CreatedAt: string;
  UpdatedAt: string;
  Documents: CitizenPropertyDocument[];
  IGRS: any;
  __appId: string;
}

// Address details for a property, nested within CitizenPropertySummary
export interface CitizenPropertyAddress {
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

// Document metadata for property documents, used in CitizenPropertySummary.Documents
export interface CitizenPropertyDocument {
  ID: string;
  PropertyID: string;
  DocumentType: string;
  DocumentName: string;
  FileStoreID: string;
  UploadDate: string;
  action: string;
  uploadedBy: string;
  size: string;
}