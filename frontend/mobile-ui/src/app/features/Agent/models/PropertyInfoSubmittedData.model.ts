// This file defines TypeScript interfaces for submitted property info data in Agent workflows.
// Used for typing form submissions, property details, usage, assessment, and documents.
import type { Owner } from "../../Citizen/models/Owner.model";

// Main data structure for submitted property info
export interface PropertyInfoSubmittedData {
    propertyId: string;
    owner: Owner;
    propertyDetails: PropertyDetails;
    usageDetails: UsageDetails;
    assessmentDetails: AssessmentDetails;
    documents: Document[];
}

// Basic property details (type, location, area)
export interface PropertyDetails {
    propertyType: string;
    zoneWard: string;
    doorNo: string;
    plotArea: string;
}

// Usage details for property (survey, GIS, cadastral info)
export interface UsageDetails {
    surveyNumber: string;
    gisDelination: string;
    gisReference: string;
    cadastralMap: string;
    gisRegistration: string;
}

// Assessment details for property (construction, usage, tax zone)
export interface AssessmentDetails {
    constructionYear: number;
    buildingUsage: string;
    builtUpArea: string;
    floorCount: number;
    propertyTaxZone: string;
    assessmentStatus: string;
    notes: string;
}

// Document metadata for submitted files
export interface Document {
    id: string;
    name: string;
    type: string;
    url?: string;
}