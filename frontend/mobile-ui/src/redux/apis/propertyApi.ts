// API slice for property operations (submit, update, fetch by ID)
import { apiSlice } from '../apiSlice';
import { TAG_TYPES } from '../tagTypes';
import type { Address } from './addressApi';
import type { Owner } from './ownerApi';


export interface AssessmentDetails {
  reason: string;
  occupancyCertificateNumber: string;
  occupancyCertificateDate: string;
  extentOfSite: number;
  landUnderBuilding: number;
  isUnspecifiedShare: boolean;
}

export interface ISGRDetails {
  habitation: string;
  igrsWard: string;
  igrsLocality: string;
  igrsBlock: string;
  doorNoFrom: string;
  doorNoTo: string;
  igrsClassification: string;
  builtUpArea: string;
  frontSetBack: string;
  rearSetBack: string;
  sideSetBack: string;
  totalPlintArea: string;
}

export interface ISGRAdditionalDetails {
  lifts: boolean;
  toilet: boolean;
  watertap: boolean;
  cableConnection: boolean;
  electricity: boolean;
  attachedBathroom: boolean;
  waterHarvesting: boolean;
}

export interface ConstructionDetails {
  floorType: string;
  roofType: string;
  wallType: string;
  woodType: string;
}

export interface FloorDetails {
  floorNumber: string;
  buildingClassification: string;
  igrsClassification: string;
  natureOfUsage: string;
  firmName: string;
  occupancy: string;
  occupantName: string;
  constructionDate: string;
  effectiveFromDate: string;
  unstructuredLand: string;
  length: number;
  breadth: number;
  plinthArea: number;
  buildingPermissionNo: string;
  floorsDetailsEntered: boolean;
}

export interface DocumentFile {
  fileStoreId: string;
  fileSize: number;
  dateOfUpload: string;
  fileName: string;
  fileType: string;
  documentType?: string;
}

export interface Document {
  documentType: string;
  serialNoLabel: string;
  revenueDocumentNumber: string;
  files: DocumentFile[];
}

export interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp?: string;
  drawnShapes?: Array<{
    type: 'point' | 'rectangle' | 'polygon';
    coordinates: number[] | number[][];
    area?: number;
    address?: string;
  }>;
}

// API Request interfaces
export interface PropertyBasicsRequest {
  ownershipType: string;
  propertyType: string;
  complexName?: string;
}

export interface LocationDataRequest {
  sessionId: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  drawnShapes?: Array<{
    type: 'point' | 'rectangle' | 'polygon';
    coordinates: number[] | number[][];
    area?: number;
    address?: string;
  }>;
}

export interface PropertyFormRequest {
  sessionId?: string;
  categoryOfOwnership: string;
  propertyType: string;
  apartmentName: string;
  locationData?: LocationData;
  owners?: Owner[];
  propertyAddress?: Address;
  assessmentDetails?: AssessmentDetails;
  isgrDetails?: ISGRDetails;
  isgrAdditionalDetails?: ISGRAdditionalDetails;
  constructionDetails?: ConstructionDetails;
  floors?: FloorDetails[];
  documents?: Document[];
}

export interface LocationDataResponse {
  data: {
    ID: string;
    PropertyID: string;
    GISData: {
      ID: string;
      Source: string;
      Type: string;
      PropertyID: string;
      Coordinates: Array<{
        ID: string;
        Latitude: number;
        Longitude: number;
        GISDataID: string;
      }>;
    };
  };
  message: string;
  success: boolean;
}

export interface PropertyDraftResponse {
  data: {
    ID: string;
    ApplicationNo: string;
    PropertyID: string;
    IsDraft: boolean;
    Property: any;
    CreatedAt: string;
    UpdatedAt: string;
  };
  message: string;
  success: boolean;
}

export interface UpdatePropertyRequest {
  propertyId: string;
  ownershipType: string;
  propertyType: string;
  complexName: string;
  address: Address;
  propertyNo: string;
}

export interface PropertyBasicsResponse {
  data: {
    ID: string;
    PropertyNo: string;
    OwnershipType: string;
    PropertyType: string;
    ComplexName: string;
    Address: any | null;
    AssessmentDetails: any | null;
    Amenities: any | null;
    ConstructionDetails: any | null;
    AdditionalDetails: any | null;
    GISData: any | null;
    CreatedAt: string;
    UpdatedAt: string;
    Documents: any | null;
    IGRS: any | null;
  };
  message: string;
  success: boolean;
}

export interface PropertyDetailsResponse {
  success: boolean;
  message: string;
  data: {
    ID: string;
    PropertyNo: string;
    OwnershipType: string;
    PropertyType: string;
    ComplexName: string;
    Owners: Owner[] | null;
    Address: {
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
    } | null;
    AssessmentDetails: {
      ID: string;
      ReasonOfCreation: string;
      OccupancyCertificateNumber: string;
      OccupancyCertificateDate: string;
      ExtentOfSite: string;
      IsLandUnderneathBuilding: boolean;
      IsUnspecifiedShare: boolean;
      PropertyID: string;
      CreatedAt: string;
      UpdatedAt: string;
    } | null;
    Amenities: {
      ID: string;
      type: string[];
      Description: string;
      ExpiryDate: string | null;
      PropertyID: string;
      CreatedAt: string;
      UpdatedAt: string;
    } | null;
    ConstructionDetails: {
      ID: string;
      FloorType: string;
      WallType: string;
      RoofType: string;
      WoodType: string;
      PropertyID: string;
      FloorDetails: Array<{
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
      }>;
      CreatedAt: string;
      UpdatedAt: string;
    } | null;
    AdditionalDetails: {
      ID: string;
      FieldName: string;
      fieldValue: {
        DocumentType: number;
        revenueDocumentNo: number;
        serialNo: number;
      };
      PropertyID: string;
      CreatedAt: string;
      UpdatedAt: string;
    } | null;
    GISData: {
      ID: string;
      Source: string;
      Type: string;
      EntityType: string;
      PropertyID: string;
      Latitude: number;
      Longitude: number;
      Coordinates: Array<{
        ID: string;
        Latitude: number;
        Longitude: number;
        GISDataID: string;
        CreatedAt: string;
      }>;
      CreatedAt: string;
      UpdatedAt: string;
    } | null;
    Documents: Array<{
      ID: string;
      PropertyID: string;
      DocumentType: string;
      DocumentName: string;
      FileStoreID: string;
      UploadDate: string;
      action: string;
    }> | null;
    IGRS: {
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
    } | null;
    CreatedAt: string;
    UpdatedAt: string;
  };
}

export interface UpdatePropertyResponse {
  data: any;
  message: string;
  success: boolean;
}
// Inject endpoints for property CRUD and step-wise updates
export const propertyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit property basics (first step of property form)
    submitPropertyBasics: builder.mutation<PropertyBasicsResponse, PropertyBasicsRequest>({
      query: (data) => ({
        url: '/v1/properties',
        method: 'POST',
        body: {
          ownershipType: data.ownershipType,
          propertyType: data.propertyType,
          complexName: data.complexName
        },
      }),
      invalidatesTags: ['Property'],
    }),

    // Update the existing property by ID
    updateProperty: builder.mutation<UpdatePropertyResponse, UpdatePropertyRequest>({
      query: ({ propertyId, ...body }) => ({
        url: `/v1/properties/${propertyId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [TAG_TYPES.PROPERTY],
    }),

    // Fetch property details by property ID
    getPropertyById: builder.query<PropertyDetailsResponse, string>({
      query: (propertyId) => `/v1/properties/${propertyId}`,
      providesTags: (_result, _error, propertyId) => [
        { type: TAG_TYPES.PROPERTY, id: propertyId },
      ],
    }),

    // Update property details for a specific step (dummy endpoint for step-wise form)
    updatePropertyDetails: builder.mutation<any, { sessionId: string; stepData: any; step: number }>({
      query: ({ sessionId, stepData, step }) => ({
        url: `/api/property/${sessionId}/step/${step}`,
        method: 'PUT',
        body: stepData,
      }),
      invalidatesTags: ['Property'],
    }),
  }),
});

// Export hooks for using property endpoints in components
export const {
  useSubmitPropertyBasicsMutation,
  useUpdatePropertyMutation,
  useUpdatePropertyDetailsMutation,
  useGetPropertyByIdQuery,
  useLazyGetPropertyByIdQuery
} = propertyApi;

export default propertyApi;