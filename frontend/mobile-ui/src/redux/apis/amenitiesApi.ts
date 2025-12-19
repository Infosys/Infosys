// API slice for amenities-related operations (CRUD)
import { apiSlice } from '../apiSlice';

// Amenity data model and API response/request types
export interface Amenity {
  ID?: string;
  type: string[];
  Description: string;
  ExpiryDate?: string;
  PropertyID?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface AmentyResponse {
  data: Amenity[];
  message: string;
  success: boolean;
}

export interface AmentyByPropertyResponse {
  data: Amenity;
  message: string;
  success: boolean;
}

export interface CreateAmenityRequest {
  property_id: string;
  type: string[];
}

export interface CreateAmenityResponse {
  data: {
    ID: string;
    type: string[];
    Description: string;
    ExpiryDate: string | null;
    PropertyID: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  message: string;
}

export interface UpdateAmenityRequest {
  amenityId: string;
  property_id: string;
  type: string[];
  Description?: string;
  ExpiryDate?: string | null;
  PropertyID?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface UpdateAmenityResponse {
  data: {
    ID: string;
    type: string[];
    Description: string;
    ExpiryDate: string | null;
    PropertyID: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  message: string;
}

export interface GetAmenityByIdResponse {
  data: {
    ID: string;
    Type: string[];
    Description: string;
    ExpiryDate: string | null;
    PropertyID: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  message: string;
  success: boolean;
}

export interface DeleteAmenityResponse {
  message: string;
  success: boolean;
}

export interface SelectedAmenitiesRequest {
  propertyId?: string;
  sessionId?: string;
  amenities: {
    lifts: boolean;
    toilet: boolean;
    watertap: boolean;
    cableConnection: boolean;
    electricity: boolean;
    attachedBathroom: boolean;
    waterHarvesting: boolean;
  };
}

// Inject endpoints for amenities CRUD operations
export const amenitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all amenities
    getAmenities: builder.query<AmentyResponse, void>({
      query: () => '/v1/amenities',
      providesTags: ['Amenities'],
    }),

    // Fetch amenities by property ID
    getAmenitiesByPropertyId: builder.query<AmentyByPropertyResponse, string>({
      query: (propertyId) => `/v1/amenities/property/${propertyId}`,
      providesTags: ['Amenities'],
    }),

    // Fetch a single amenity by its ID
    getAmenityById: builder.query<GetAmenityByIdResponse, string>({
      query: (amenityId) => `/v1/amenities/${amenityId}`,
      providesTags: ['Amenities'],
    }),

    // Create a new amenity for a property
    createAmenity: builder.mutation<CreateAmenityResponse, CreateAmenityRequest>({
      query: (data) => ({
        url: '/v1/amenities',
        method: 'POST',
        body: {
          property_id: data.property_id,
          type: data.type
        },
      }),
      invalidatesTags: ['Amenities'],
    }),

    // Update an existing amenity by amenity ID
    updateAmenity: builder.mutation<UpdateAmenityResponse, UpdateAmenityRequest>({
      query: ({ amenityId, ...data }) => ({
        url: `/v1/amenities/${amenityId}`,
        method: 'PUT',
        body: {
          property_id: data.property_id,
          type: data.type,
          Description: data.Description || '',
          ExpiryDate: data.ExpiryDate || null,
          PropertyID: data.PropertyID || data.property_id,
          CreatedAt: data.CreatedAt,
          UpdatedAt: data.UpdatedAt
        },
      }),
      invalidatesTags: ['Amenities'],
    }),

    // Delete an amenity by its ID
    deleteAmenity: builder.mutation<DeleteAmenityResponse, string>({
      query: (amenityId) => ({
        url: `/v1/amenities/${amenityId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Amenities'],
    }),

    // Save selected amenities for a property (used for bulk update)
    saveSelectedAmenities: builder.mutation<any, SelectedAmenitiesRequest>({
      query: ({ sessionId, propertyId, amenities }) => ({
        url: sessionId 
          ? `/v1/properties/${sessionId}/amenities` 
          : `/v1/properties/${propertyId}/amenities`,
        method: 'POST',
        body: amenities,
      }),
      invalidatesTags: ['Property', 'Amenities'],
    }),
  }),
});

// Export hooks for using amenities endpoints in components
export const {
  useGetAmenitiesQuery,
  useLazyGetAmenitiesQuery,
  useGetAmenitiesByPropertyIdQuery,
  useLazyGetAmenitiesByPropertyIdQuery,
  useGetAmenityByIdQuery,
  useLazyGetAmenityByIdQuery,
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useSaveSelectedAmenitiesMutation,
} = amenitiesApi;

export default amenitiesApi;