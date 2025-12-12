// This file defines TypeScript interfaces for Agent review page data models.
// Used for typing API responses, property details, and application items for review workflows.
import type {Address, AssessmentDetails, ConstructionDetails, GISData, Amenity, Document, AdditionalDetails} from "./HomePageData.model";

// Property details for review page, includes all related entities
export interface PropertyDetails {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  Address: Address;
  AssessmentDetails: AssessmentDetails;
  Amenities: Amenity[];
  ConstructionDetails: ConstructionDetails;
  AdditionalDetails: AdditionalDetails;
  GISData: GISData;
  CreatedAt: string;
  UpdatedAt: string;
  Documents: Document;
  IGRS: any;
}

// Application item for review workflows
export interface ApplicationItem {
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

// Pagination info for paginated API responses
export interface PaginationInfo {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

// API response for Agent review page property list
export interface ApplicationsResponse {
  data: ApplicationItem[];
  message: string;
  pagination: PaginationInfo;
  success: boolean;
}