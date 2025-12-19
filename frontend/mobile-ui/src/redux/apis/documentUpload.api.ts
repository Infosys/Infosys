// API slice for document upload details (fetch, create, update)
import type { DocumentUploadDetailsRequest, DocumentUploadDetailsResponse } from '../../app/features/PropertyForm/models/documentsUpload.model';
import { apiSlice } from '../../redux/apiSlice';

export const documentsUploadDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch document upload details by property ID
    getDocumentsUploadDetailsByPropertyId: builder.query<DocumentUploadDetailsResponse, string>({
      query: (propertyId) => ({
        url: `/v1/documents/property/${propertyId}`,
        method: 'GET',
      }),
    }),
    // Create new document upload details
    createDocumentUploadDetails: builder.mutation<DocumentUploadDetailsResponse, DocumentUploadDetailsRequest>({
      query: (body) => ({
        url: '/v1/documents',
        method: 'POST',
        body,
      }),
    }),
    // Update document upload details by document ID
    updateDocumentUploadDetails: builder.mutation<DocumentUploadDetailsResponse, { document_id: string; body: DocumentUploadDetailsRequest }>({
      query: ({ document_id, body }) => ({
        url: `/v1/documents/${document_id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

// Export hooks for using document upload endpoints in components
export const {
  useGetDocumentsUploadDetailsByPropertyIdQuery,
  useCreateDocumentUploadDetailsMutation,
  useUpdateDocumentUploadDetailsMutation,
} = documentsUploadDetailsApi;