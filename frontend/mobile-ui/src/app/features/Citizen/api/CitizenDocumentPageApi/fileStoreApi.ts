// fileStoreApi defines API endpoints for file upload and retrieval for Citizen document workflows.
// Uses Redux Toolkit Query to provide hooks for file blob fetching and uploading to filestore.
import { filestoreApiSlice } from '../../../../../redux/fileStoreApiSlice';
import type { UploadResult } from '../../models/CitizenDocumentPageModel/fileStoreModel';

// Response type for file URL lookup
export interface FileUrlResponse {
  url: string;
  fileStoreId: string;
}

// Inject endpoints for file blob retrieval and file upload
export const filestoreApi = filestoreApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch file directly as blob (not URL)
    getFileBlob: builder.query<Blob, { fileStoreId: string; tenantId?: string }>(
      {
        query: ({ fileStoreId, tenantId = "pg" }) => ({
          url: `/filestore/v1/files/${fileStoreId}?tenantId=${tenantId}`,
          method: 'GET',
          responseHandler: (response) => response.blob(), // Get blob directly
        }),
      }
    ),

    // Upload file to filestore using multipart/form-data
    uploadFileToFilestore: builder.mutation<UploadResult, { file: File; tenantId?: string; module?: string; tag?: string }>(
      {
        query: ({ file, tenantId = "pg", module = "HCM-ADMIN-CONSOLE-CLIENT", tag = "test" }) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('tenantId', tenantId);
          formData.append('module', module);
          formData.append('tag', tag);

          return {
            url: '/filestore/v1/files',
            method: 'POST',
            body: formData,
          };
        },
      }
    ),
  }),
});

// Export RTK Query hooks for file blob and upload operations
export const {
  useGetFileBlobQuery,
  useLazyGetFileBlobQuery,
  useUploadFileToFilestoreMutation,
} = filestoreApi;