
// Request payload for updating a document's status (verify or reject)
export interface UpdateDocumentRequest {
  documentId: string;                // The ID of the document to update
  action: "VERIFIED" | "REJECTED"; // The action to perform on the document
}


// Response payload for updating a document's status
export interface UpdateDocumentResponse {
  message: string; // Response message from the API
  data: {
    ID: string;           // Document ID
    PropertyID: string;   // Associated property ID
    DocumentType: string; // Type of document
    DocumentName: string; // Name of the document
    FileStoreID: string;  // File store identifier
    UploadDate: string;   // Date the document was uploaded
    action: string;       // Current action/status (e.g., VERIFIED, REJECTED)
  };
}