// documentUpload.api.ts
// This file defines RTK Query API endpoints for managing document uploads related to property forms.
// Endpoints include fetch, create, update, and delete document upload details.
// Uses Redux Toolkit Query for data fetching and mutation, with tag-based cache management.
// Types:
//   DocumentUploadDetailsRequest: request payload for document upload
//   DocumentUploadDetailsResponse: response payload for upload operations

import { apiSlice } from '../../../../redux/apiSlice';
import { TAG_TYPES } from '../../../../redux/tagTypes';
import type { DocumentUploadDetailsRequest, DocumentUploadDetailsResponse } from '../models/documentsUpload.model';

export const documentsUploadDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to fetch document upload details by property ID
    getDocumentsUploadDetailsByPropertyId: builder.query<DocumentUploadDetailsResponse, string>({
      query: (propertyId) => ({
        url: `/v1/documents/property/${propertyId}`,
        method: 'GET',
      }),
      providesTags:[TAG_TYPES.DOCUMENT]
    }),
    // Mutation to create new document upload details
    createDocumentUploadDetails: builder.mutation<DocumentUploadDetailsResponse, DocumentUploadDetailsRequest>({
      query: (body) => ({
        url: '/v1/documents',
        method: 'POST',
        body, // Send array directly
      }),
      invalidatesTags:[TAG_TYPES.DOCUMENT]  
    }),
    // Mutation to update document upload details by document ID
    updateDocumentUploadDetails: builder.mutation<DocumentUploadDetailsResponse, { document_id: string; body: DocumentUploadDetailsRequest }>({
      query: ({ document_id, body }) => ({
        url: `/v1/documents/${document_id}`,
        method: 'PUT',
        body,
      }),
    }),
    // Mutation to delete document upload details by document ID
    deleteDocumentUploadDetails: builder.mutation<{ message: string }, string>({
      query: (documentId) => ({
        url: `/v1/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags:[TAG_TYPES.DOCUMENT]
    }),
  }),
});

export const {
  useGetDocumentsUploadDetailsByPropertyIdQuery,
  useCreateDocumentUploadDetailsMutation,
  useUpdateDocumentUploadDetailsMutation,
  useDeleteDocumentUploadDetailsMutation,
} = documentsUploadDetailsApi;