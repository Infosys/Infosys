// Represents the result of a file upload operation
export interface UploadResult {
  files: {
    fileStoreId: string; // Unique identifier for the uploaded file in the file store
    tenantId: string;    // Tenant or jurisdiction ID associated with the file
  }[];
}
 