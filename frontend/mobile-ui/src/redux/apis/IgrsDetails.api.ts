// API slice for IGRS details operations (create, update, fetch by ID)
import type { IgrsDetailsRequest, IgrsDetailsUpdateRequest, IgrsDetailsResponse } from '../../app/features/PropertyForm/models/IgrsDetails.model';
import apiSlice from '../apiSlice';

export const igrsDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new IGRS details
    createIgrsDetails: builder.mutation<IgrsDetailsResponse, IgrsDetailsRequest>({
      query: (body) => ({
        url: '/v1/igrs',
        method: 'POST',
        body,
      }),
    }),
    // Update IGRS details by ID
    updateIgrsDetails: builder.mutation<IgrsDetailsResponse, { id: string; applicationId: string; isVerifying: boolean; body: IgrsDetailsUpdateRequest }>({
      query: ({ id, applicationId, isVerifying, body }) => ({
        url: `/v1/igrs/${id}/${applicationId}?isVerifying=${isVerifying}`,
        method: 'PUT',
        body,
      }),
    }),
    // Fetch IGRS details by ID
    getIgrsDetailsById: builder.query<IgrsDetailsResponse, string>({
      query: (igrsId) => ({
        url: `/v1/igrs/${igrsId}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for using IGRS details endpoints in components
export const {
  useCreateIgrsDetailsMutation,
  useUpdateIgrsDetailsMutation,
  useGetIgrsDetailsByIdQuery,
} = igrsDetailsApi;