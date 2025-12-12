// Types and interfaces for property applications and related data in the Service Manager Dashboard

// Priority levels for applications
export type Priority = 'High' | 'Medium' | 'Low';

// Geographic location with latitude and longitude
export interface Location {
  lat: number;
  lng: number;
}

// Details about a property associated with an application
export interface PropertyDetails {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  Address: any | null;
  AssessmentDetails: any | null;
  Amenities: any[];
  ConstructionDetails: any | null;
  AdditionalDetails: any | null;
  GISData: any | null;
  CreatedAt: string;
  UpdatedAt: string;
  Documents: any[];
}

// Model representing a property application in the dashboard
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

// Simplified application interface for internal use
export interface Application {
  id: string;
  propertyName: string;
  propertyId: string;
  date: string; // ISO 8601 format
  priority: Priority;
  month: string;
  location: Location;
}
