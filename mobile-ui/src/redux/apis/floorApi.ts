// API slice for floor details operations (CRUD, batch, validation)
import { apiSlice } from '../apiSlice';

// Floor details data models and API types
export interface FloorDetailsRequest {
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
  constructionDetailsId: string;
}

export interface FloorDetailsResponse {
  id: string;
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
  constructionDetailsId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedFloorDetailsResponse {
  data: FloorDetailsResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  message: string;
  success: boolean;
}

export interface SingleFloorDetailsResponse {
  data: FloorDetailsResponse;
  message: string;
  success: boolean;
}

export interface FloorDetailsQueryParams {
  page?: number;
  size?: number;
  constructionDetailsId?: string;
}

export interface PartialFloorDetailsUpdate {
  floorNo?: number;
  classification?: string;
  natureOfUsage?: string;
  firmName?: string;
  occupancyType?: string;
  occupancyName?: string;
  constructionDate?: string;
  effectiveFromDate?: string;
  unstructuredLand?: string;
  lengthFt?: number;
  breadthFt?: number;
  plinthAreaSqFt?: number;
  buildingPermissionNo?: string;
  floorDetailsEntered?: boolean;
  constructionDetailsId?: string;
}

// Inject endpoints for floor details CRUD, batch, and validation
export const floorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new floor details
    createFloorDetails: builder.mutation<SingleFloorDetailsResponse, FloorDetailsRequest>({
      query: (data) => ({
        url: '/v1/floor-details',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Floor'],
    }),

    // Get all floor details (supports pagination and filtering by construction ID)
    getAllFloorDetails: builder.query<PaginatedFloorDetailsResponse, FloorDetailsQueryParams>({
      query: (params = {}) => ({
        url: '/v1/floor-details',
        params: {
          page: params.page || 0,
          size: params.size || 20,
          ...(params.constructionDetailsId && { constructionDetailsId: params.constructionDetailsId }),
        },
      }),
      providesTags: ['Floor'],
    }),

    // Get floor details by unique ID
    getFloorDetailsById: builder.query<SingleFloorDetailsResponse, string>({
      query: (id) => `/v1/floor-details/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Floor', id }],
    }),

    // Update floor details by ID (full update)
    updateFloorDetails: builder.mutation<
      SingleFloorDetailsResponse,
      { id: string; data: FloorDetailsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/v1/floor-details/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Floor', id }, 'Floor'],
    }),

    // Partial update floor details by ID
    partialUpdateFloorDetails: builder.mutation<
      SingleFloorDetailsResponse,
      { id: string; data: PartialFloorDetailsUpdate }
    >({
      query: ({ id, data }) => ({
        url: `/v1/floor-details/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Floor', id }, 'Floor'],
    }),

    // Delete floor details by ID
    deleteFloorDetails: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/v1/floor-details/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Floor', id }, 'Floor'],
    }),

    // Get all floor details for a construction details ID
    getFloorDetailsByConstructionId: builder.query<PaginatedFloorDetailsResponse, string>({
      query: (constructionDetailsId) => ({
        url: '/v1/floor-details',
        params: { constructionDetailsId },
      }),
      providesTags: ['Floor'],
    }),

    // Create multiple floor details in a single request (batch)
    createMultipleFloorDetails: builder.mutation<
      { success: boolean; message: string; data: FloorDetailsResponse[] },
      FloorDetailsRequest[]
    >({
      query: (floorDetailsArray) => ({
        url: '/v1/floor-details/batch',
        method: 'POST',
        body: { floors: floorDetailsArray },
      }),
      invalidatesTags: ['Floor'],
    }),

    // Validate floor details data before submission
    validateFloorDetails: builder.mutation<
      { valid: boolean; _errors?: string[] },
      FloorDetailsRequest
    >({
      query: (data) => ({
        url: '/v1/floor-details/validate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for using floor details endpoints in components
export const {
  // Create operations
  useCreateFloorDetailsMutation,
  useCreateMultipleFloorDetailsMutation,

  // Read operations
  useGetAllFloorDetailsQuery,
  useLazyGetAllFloorDetailsQuery,
  useGetFloorDetailsByIdQuery,
  useLazyGetFloorDetailsByIdQuery,
  useGetFloorDetailsByConstructionIdQuery,
  useLazyGetFloorDetailsByConstructionIdQuery,

  // Update operations
  useUpdateFloorDetailsMutation,
  usePartialUpdateFloorDetailsMutation,

  // Delete operations
  useDeleteFloorDetailsMutation,

  // Validation operations
  useValidateFloorDetailsMutation,
} = floorApi;

export default floorApi;