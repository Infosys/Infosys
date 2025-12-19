
// RTK Query API endpoints for file storage operations (upload/download) in the application view.
import { filestoreApiSlice } from '../../../../../store/filestoreApiSlice';
import type {UploadResult} from '../model/fileStoreModel';


/**
 * Injects endpoints for file storage operations (download/upload) using RTK Query.
 */
export const filestoreApi = filestoreApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Query for downloading a file from the filestore by fileStoreId and tenantId.
     * @returns The file as a Blob object
     */
    getFileFromFilestore: builder.query<Blob, { fileStoreId: string; tenantId?: string }>({
      query: ({ fileStoreId, tenantId = "pg" }) => ({
        url: `/filestore/v1/files/${fileStoreId}?tenantId=${tenantId}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),

    /**
     * Mutation for uploading a file to the filestore.
     * @param file - The file to upload
     * @param tenantId - (Optional) Tenant ID
     * @param module - (Optional) Module name
     * @param tag - (Optional) Tag for the file
     * @returns The upload result from the backend
     */
    uploadFileToFilestore: builder.mutation<UploadResult, { file: File; tenantId?: string; module?: string; tag?: string }>({
      query: ({ file, tenantId = "pg", module = "HCM-ADMIN-CONSOLE-CLIENT", tag = "test" }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tenantId", tenantId);
        formData.append("module", module);
        formData.append("tag", tag);
        return {
          url: '/filestore/v1/files/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),  
  }),
});


// Export hooks for file download and upload operations
export const { useGetFileFromFilestoreQuery, useUploadFileToFilestoreMutation } = filestoreApi;
export default filestoreApi;