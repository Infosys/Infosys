// API slice for assessment details operations (fetch, create, update)
import type { AssessmentDetailsResponse, AssessmentDetailsRequest } from "../../app/features/PropertyForm/models/AssessmentDetails.model";
import apiSlice from "../apiSlice";

export const assessmentDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch assessment details by property ID
    getAssessmentDetailsByPropertyId: builder.query<AssessmentDetailsResponse, string>({
      query: (propertyId) => ({
        url: `/v1/assessment-details/property/${propertyId}`,
        method: 'GET',
      }),
    }),
    // Create new assessment details
    createAssessmentDetails: builder.mutation<AssessmentDetailsResponse, AssessmentDetailsRequest>({
      query: (body) => ({
        url: '/v1/assessment-details',
        method: 'POST',
        body,
      }),
    }),
    // Update existing assessment details by ID
    updateAssessmentDetails: builder.mutation<AssessmentDetailsResponse, { id: string; applicationId: string;isVerifying: boolean; body: AssessmentDetailsRequest ,}>({
      query: ({ id, applicationId, isVerifying, body }) => ({
        url: `/v1/assessment-details/${id}/${applicationId}?isVerifying=${isVerifying}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

// Export hooks for using assessment details endpoints in components
export const {
  useGetAssessmentDetailsByPropertyIdQuery,
  useCreateAssessmentDetailsMutation,
  useUpdateAssessmentDetailsMutation,
} = assessmentDetailsApi;