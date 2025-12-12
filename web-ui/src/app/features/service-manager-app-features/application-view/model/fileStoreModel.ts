
// Response payload for a file upload operation
export interface UploadResult {
  files: {
    fileStoreId: string; // Unique identifier for the uploaded file in the file store
    tenantId: string;    // Tenant ID associated with the file
  }[];
}
