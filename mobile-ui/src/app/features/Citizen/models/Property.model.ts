import type { AssessmentDetails } from "./AssessmentDetails.model";
import type { Bill } from "./Bill.model";
import type { ConstructionDetails } from "./ConstructionDetails.model";
import type { Document } from "./Document.model";
import type { FloorDetails } from "./FloorDetails.model";
import type { HistoryItem } from "./History.model";
import type { ISGRAdditionalDetails } from "./IGRSAdditionalDetails.model";
import type { ISGRDetails } from "./IGRSDetails.model";
import type { License } from "./License.model";
import type { LocationData } from "./Location.model";
import type { Owner } from "./Owner.model";
import type { PropertyAddress } from "./PropertyAddress.model";

// Represents a property and all its associated details
export interface Property {
  apartmentName: string; // Name of the apartment (if applicable)
  approvedUse: string; // Approved use of the property (e.g., residential, commercial)
  assessmentDetails: AssessmentDetails; // Assessment details for the property
  bills: Bill[]; // List of bills associated with the property
  billsAmount: number; // Total amount of all bills
  billsDue: number; // Total due amount
  builtUpArea: string; // Built-up area of the property
  categoryOfOwnership: string; // Category of ownership (e.g., freehold, leasehold)
  constructionDetails: ConstructionDetails; // Construction details
  constructionYear: number; // Year of construction
  coverage: string; // Coverage area
  currentUse: string; // Current use of the property
  district: string; // District where the property is located
  documents: Document[]; // List of property-related documents
  enumerationProgress: number; // Progress of property enumeration (e.g., for surveys)
  floors: FloorDetails[]; // Details for each floor
  frontSetback: string; // Front setback distance
  fsi: string; // Floor Space Index
  history: HistoryItem[]; // Ownership or transaction history
  hobli: string; // Hobli (administrative division)
  id: string; // Unique property identifier
  isgrAdditionalDetails: ISGRAdditionalDetails; // Additional IGRS details
  isgrDetails: ISGRDetails; // IGRS details
  issuedLicenses: number; // Number of licenses issued
  licenses: License[]; // List of licenses
  locationData: LocationData; // Location information
  owners: Owner[]; // List of property owners
  plotArea: string; // Plot area
  propertyAddress: PropertyAddress; // Address details
  propertyType: string; // Type/category of property
  propertyValue: string; // Value of the property
  rearSetback: string; // Rear setback distance
  sideSetback: string; // Side setback distance
  subdivision: string; // Subdivision name/number
  surveyNumber: string; // Survey number
  taluk: string; // Taluk (administrative division)
  utilities: any; // Utilities associated with the property
  village: string; // Village name
  ward: string; // Ward number or name
  zoning: string; // Zoning information
}