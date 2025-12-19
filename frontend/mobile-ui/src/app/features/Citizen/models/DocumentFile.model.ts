// Represents a file associated with a document
export type DocumentFile = {
  fileName: string; // Name of the file
  fileSize: number; // Size of the file in bytes
  fileType: string; // MIME type of the file
  fileStoreId: string; // Unique identifier in the file store
  dateOfUpload: string; // Date when the file was uploaded
}