// documentInfo.api.ts
// This file defines RTK Query API endpoints for managing document info related to property forms.
// Endpoints include create, fetch by property ID, and update document info.
// Uses Redux Toolkit Query for data fetching and mutation, with tag-based cache management.
// Types:
//   DocumentInfoRequest: request payload for document info
//   DocumentInfoResponse: response payload for create/update
//   DocumentInfoGetResponse: response payload for fetch

import { apiSlice } from '../../../../redux/apiSlice';
import { TAG_TYPES } from '../../../../redux/tagTypes';
import type { DocumentInfoRequest, DocumentInfoResponse, DocumentInfoGetResponse } from '../models/documentInfo.model';

export const documentInfoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to create new document info for a property
    createDocumentInfo: builder.mutation<DocumentInfoResponse, DocumentInfoRequest>({
      query: (body) => ({
        url: '/v1/additional-property-details',
        method: 'POST',
        body,
      }),
      invalidatesTags: [TAG_TYPES.DOCUMENT_INFO],
    }),
    // Query to fetch document info by property ID
    getDocumentInfoByPropertyId: builder.query<DocumentInfoGetResponse, string>({
      query: (propertyId) => ({
        url: `/v1/additional-property-details/property/${propertyId}?fieldName=DocumentInfo`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.DOCUMENT_INFO],
    }),
    // Mutation to update document info by document ID
    updateDocumentInfo: builder.mutation<DocumentInfoResponse, { documentId: string; body: DocumentInfoRequest }>({
      query: ({ documentId, body }) => ({
        url: `/v1/additional-property-details/${documentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [TAG_TYPES.DOCUMENT_INFO],
    }),
  }),
});

export const {
  useCreateDocumentInfoMutation,
  useGetDocumentInfoByPropertyIdQuery,
  useUpdateDocumentInfoMutation,
} = documentInfoApi;