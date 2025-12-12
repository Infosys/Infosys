// Represents details for a single document upload
export interface DocumentUploadDetails {
  PropertyId: string; // Linked property ID
  DocumentType: string; // Type of document
  DocumentName: string; // Name of the document
  FileStoreID: string; // File store identifier
}

// Response structure for document upload API
export interface DocumentUploadDetailsResponse {
  message: string; // Response message
  data: {
    ID: string; // Unique document upload ID
    PropertyID: string; // Linked property ID
    DocumentType: string; // Type of document
    DocumentName: string; // Name of the document
    FileStoreID: string; // File store identifier
    UploadDate: string; // Date of upload
    action: string; // Action performed (e.g., upload, delete)
    uploadedBy?: string; // User who uploaded (optional)
    size?: string; // File size (optional)
  }[];
}

// Array type for the document upload request
export type DocumentUploadDetailsRequest = DocumentUploadDetails[];
