// This file defines an RTK Query API slice for fetching files as blobs from the filestore service.
import { filestoreApiSlice } from '../../../../../store/filestoreApiSlice';


// Response type can be Blob
// API slice for filestore-related queries (fetching files as blobs)
export const filestoreApi = filestoreApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Add the endpoint for fetching blob from filestore
    // Endpoint to fetch a file as a Blob from the filestore by fileStoreId and tenantId
    getFileFromFilestore: builder.query<Blob, { fileStoreId: string; tenantId?: string }>({
      query: ({ fileStoreId, tenantId = "pg" }) => ({
        url: `/filestore/v1/files/${fileStoreId}?tenantId=${tenantId}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
      // Optionally: tags if you cache blobs
      // providesTags: [TAG_TYPES.FILESTORE],
    }),
  }),
});

// Hook for fetching a file as a Blob from the filestore
export const { useGetFileFromFilestoreQuery } = filestoreApi;