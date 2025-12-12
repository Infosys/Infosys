
// RTK Query API endpoint for updating document actions (e.g., approve, reject) in the application view.
import { apiSlice } from '../../../../../store/apiSlice';
import onboardingApiSlice from '../../../../../store/onboardingApiSlice';
import { TAG_TYPES } from '../../../../../store/tagTypes';
import type { UpdateDocumentRequest, UpdateDocumentResponse } from '../model/documentsModel';


/**
 * Injects an endpoint for updating the action/status of a document (e.g., approve, reject) using RTK Query.
 * Uses a PUT request to update the document by its ID.
 */
export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Mutation for updating a document's action/status.
     * @param documentId - The ID of the document to update
     * @param action - The action to perform (e.g., approve, reject)
     * @returns The response from the backend
     */
    updateDocumentAction: builder.mutation<UpdateDocumentResponse, UpdateDocumentRequest>({
      query: ({ documentId, action }) => ({
        url: `/v1/documents/${documentId}`,
        method: 'PUT',
        body: { action },
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'default',
        },
      }),
      // Invalidate the applications cache after document update
      invalidatesTags: [TAG_TYPES.APPLICATIONS],
    }),
  }),
});


// Inject a common endpoint to get user by id
export const extendedOnboardingApi = onboardingApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserById: builder.query<any, string>({
            query: (id: string) => `/api/v1/users/${id}`,
        }),
    }),
    overrideExisting: false,
});

// Export hooks for the injected endpoints
export const { useGetUserByIdQuery } = extendedOnboardingApi;


export const { useUpdateDocumentActionMutation } = documentsApi;