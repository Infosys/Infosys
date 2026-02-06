// API slice for construction details operations (CRUD, fetch by property, pagination)
import { apiSlice } from '../apiSlice';

// Construction details data models and API types
export interface ConstructionDetails {
  ID?: string;
  FloorType: string;
  WallType: string;
  RoofType: string;
  WoodType: string;
  PropertyId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConstructionDetailsRequest {
  floorType: string;
  wallType: string;
  roofType: string;
  woodType: string;
  propertyId: string;
}

export interface ConstructionDetailsResponse {
  data: {
    ID: string;
    floorType: string;
    wallType: string;
    roofType: string;
    woodType: string;
    propertyId: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  success: boolean;
}

export interface ConstructionDetailsListResponse {
  data: ConstructionDetails[];
  message: string;
  success: boolean;
  totalCount?: number;
  currentPage?: number;
  perPage?: number;
}

export interface GetConstructionDetailsParams {
  page?: number;
  size?: number;
  propertyId?: string;
}

// Inject endpoints for construction details CRUD and queries
export const constructionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new construction details
    createConstructionDetails: builder.mutation<ConstructionDetailsResponse, ConstructionDetailsRequest>({
      query: (data) => ({
        url: '/v1/construction-details',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Construction'],
    }),

    // Get all construction details (supports pagination and filtering by property)
    getAllConstructionDetails: builder.query<ConstructionDetailsListResponse, GetConstructionDetailsParams>({
      query: ({ page = 0, size = 20, propertyId }) => ({
        url: '/v1/construction-details',
        params: {
          page,
          size,
          ...(propertyId && { propertyId }),
        },
      }),
      providesTags: ['Construction'],
      transformResponse: (response: ConstructionDetailsListResponse, meta) => {
        // Extract pagination info from response headers if available
        const headers = meta?.response?.headers;
        return {
          ...response,
          totalCount: headers?.get('X-Total-Count') ? Number.parseInt(headers.get('X-Total-Count') || '0') : undefined,
          currentPage: headers?.get('X-Current-Page') ? Number.parseInt(headers.get('X-Current-Page') || '0') : undefined,
          perPage: headers?.get('X-Per-Page') ? Number.parseInt(headers.get('X-Per-Page') || '20') : undefined,
        };
      },
    }),

    // Get construction details by unique ID
    getConstructionDetailsById: builder.query<ConstructionDetailsResponse, string>({
      query: (id) => `/v1/construction-details/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Construction', id }],
    }),

    // Get all construction details for a property
    getConstructionDetailsByPropertyId: builder.query<ConstructionDetailsListResponse, string>({
      query: (propertyId) => `/v1/construction-details/property/${propertyId}`,
      providesTags: (_result, _error, propertyId) => [{ type: 'Construction', id: propertyId }],
    }),

    // Update construction details by ID
    updateConstructionDetails: builder.mutation<ConstructionDetailsResponse, { id: string | number; applicationId: string; isVerifying: boolean; data: ConstructionDetailsRequest }>({
      query: ({ id, applicationId, isVerifying, data }) => ({
        url: `/v1/construction-details/${id}/${applicationId}?isVerifying=${isVerifying}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Construction', id },
        'Construction',
      ],
    }),

    // Delete construction details by ID
    deleteConstructionDetails: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/v1/construction-details/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Construction', id },
        'Construction',
      ],
    }),
  }),
});

// Export hooks for using construction details endpoints in components
export const {
  useCreateConstructionDetailsMutation,
  useGetAllConstructionDetailsQuery,
  useLazyGetAllConstructionDetailsQuery,
  useGetConstructionDetailsByIdQuery,
  useLazyGetConstructionDetailsByIdQuery,
  useGetConstructionDetailsByPropertyIdQuery,
  useLazyGetConstructionDetailsByPropertyIdQuery,
  useUpdateConstructionDetailsMutation,
  useDeleteConstructionDetailsMutation,
} = constructionApi;

export default constructionApi;