// API slice for file store operations (upload, fetch files)
import { filestoreApiSlice } from '../../redux/fileStoreApiSlice';

// Response type for file upload
export interface UploadResult {
  files: {
    fileStoreId: string;
    tenantId: string;
  }[];
}


export const filestoreApi = filestoreApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch a file from the file store by fileStoreId and tenantId
    getFileFromFilestore: builder.query<Blob, { fileStoreId: string; tenantId?: string }>({
      query: ({ fileStoreId, tenantId = "pg" }) => ({
        url: `/filestore/v1/files/${fileStoreId}?tenantId=${tenantId}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Upload a file to the file store
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

// Export hooks for using file store endpoints in components
export const { useGetFileFromFilestoreQuery, useUploadFileToFilestoreMutation } = filestoreApi;
export default filestoreApi;