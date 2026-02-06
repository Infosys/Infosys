// PropertyFormContext.tsx
// Provides context for managing the state of the property form, including all form sections and updates.
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Owner } from '../redux/apis/ownerApi';
import type { Address } from '../redux/apis/addressApi';

// Address details for a property
export interface PropertyAddress {
  locality: string;
  zoneNo: string;
  wardNo: string;
  blockNo: string;
  street: string;
  electionWard: string;
  secretariatWard: string;
  pincode: string;
  isCorrespondenceAddressDifferent: boolean;
  correspondenceAddress1: string;
  correspondenceAddress2: string;
  correspondencePincode: string;
}

// Assessment details for a property
export interface AssessmentDetails {
  ID?: string;
  ReasonOfCreation: string;
  OccupancyCertificateNumber: string;
  OccupancyCertificateDate: string;
  ExtentOfSite: string;
  IsLandUnderneathBuilding: string;
  IsUnspecifiedShare: boolean;
}

// ISGR (Integrated Survey & GIS Records) details for a property
export interface ISGRDetails {
  id?: string;
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
}

// Additional ISGR details (amenities, utilities)
export interface ISGRAdditionalDetails {
  lifts: boolean;
  toilet: boolean;
  watertap: boolean;
  cableConnection: boolean;
  electricity: boolean;
  attachedBathroom: boolean;
  waterHarvesting: boolean;
  amenityId?: string;
}

// Construction details for a property
export interface ConstructionDetails {
  floorType: string;
  roofType: string;
  wallType: string;
  woodType: string;
  id?: number | string;
}

// Details for each floor in a property
export interface FloorDetails {
  floorNumber: string;
  buildingClassification: string;
  igrsClassification: string;
  natureOfUsage: string;
  firmName: string;
  occupancy: string;
  occupantName: string;
  constructionDate: string;
  mezzanineArea: number;
  effectiveFromDate: string;
  unstructuredLand: string;
  length: number;
  breadth: number;
  plinthArea: number;
  buildingPermissionNo: string;
  floorsDetailsEntered: boolean;
}

// File metadata for uploaded property documents
export interface DocumentFile {
  fileStoreId: string;
  fileSize: number;
  dateOfUpload: string;
  fileName: string;
  fileType: string;
  documentType?: string;
}

// Document details for property application
export interface Document {
  documentType: string;
  serialNoLabel: string;
  revenueDocumentNumber: string;
  files: DocumentFile[];
}

// Location and GIS data for a property
export interface LocationData {
  gisDataId?: string;
  address: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  timestamp?: string;
  drawnShapes?: Array<{
    id?: number;
    type: 'point' | 'rectangle' | 'polygon';
    coordinates: number[] | number[][];
    area?: number;
    address?: string;
  }>;
}

// Main property form data structure
export interface PropertyFormData {
  id: any;
  typeOfLand: string;
  noOfFloors? : number;
  noOfBasements? : number;
  hasMezzanine?: boolean;
  noOfBuildings? : number;
  buildingName? :string;
  categoryOfOwnership: string;
  propertyType: string;
  apartmentName: string;
  propertyNo?: string;
  locationData?: LocationData;
  owners: Owner[];
  propertyAddress?: Address;
  assessmentDetails?: AssessmentDetails;
  isgrDetails: ISGRDetails;
  isgrAdditionalDetails?: ISGRAdditionalDetails;
  constructionDetails?: ConstructionDetails;
  floors?: FloorDetails[];
  documents?: Document[];
  importantNotes?: string;
}

// ...existing code...
// Default/initial property form data
const defaultFormData: PropertyFormData = {
  id: null,
  categoryOfOwnership: '',
  propertyType: '',
  apartmentName: '',
  typeOfLand: '',
  noOfFloors: undefined,
  noOfBasements: undefined,
  hasMezzanine: undefined,
  owners: [],
  isgrDetails: {
    id: '',
    habitation: '',
    igrsWard: '',
    igrsLocality: '',
    igrsBlock: '',
    doorNoFrom: '',
    doorNoTo: '',
    igrsClassification: '',
    builtUpAreaPct: 0,
    frontSetback: 0,
    rearSetback: 0,
    sideSetback: 0,
    totalPlinthArea: 0,
  },
};

// Create PropertyFormContext for sharing property form state
const PropertyFormContext = createContext<
  | {
      formData: PropertyFormData;
      updateForm: (newData: Partial<PropertyFormData>) => void;
      resetForm: () => void;
    }
  | undefined
>(undefined);

// Custom hook to access PropertyFormContext
export const usePropertyForm = () => {
  const ctx = useContext(PropertyFormContext);
  if (!ctx) throw new Error('usePropertyForm must be used within PropertyFormProvider');
  return ctx;
};

// Provider component for PropertyFormContext
export const PropertyFormProvider = ({ children }: { children: ReactNode }) => {
  // State for property form data
  const [formData, setFormData] = useState<PropertyFormData>(defaultFormData);

  // Update form data with new values
  const updateForm = (newData: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Reset form data to default values
  const resetForm = () => setFormData(defaultFormData);

  // Provide property form state and handlers to children
  return (
    <PropertyFormContext.Provider value={{ formData, updateForm, resetForm }}>
      {children}
    </PropertyFormContext.Provider>
  );
};
