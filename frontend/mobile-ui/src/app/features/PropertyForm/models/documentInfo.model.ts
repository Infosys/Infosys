// Represents the value of a document info field
export interface DocumentInfoFieldValue {
  DocumentType: number | string; // Document type (can be number or string)
  serialNo: number; // Serial number of the document
  revenueDocumentNo: number; // Revenue document number
}

// Request payload for submitting document info
export interface DocumentInfoRequest {
  fieldName: string; // Name of the document info field
  fieldValue: DocumentInfoFieldValue; // Value of the field
  propertyId: string; // Linked property ID
}

// Response structure for document info API (single item)
export interface DocumentInfoResponse {
  success: boolean; // Indicates if the API call was successful
  message: string; // Response message
  data?: {
    ID: string; // Unique document info ID
    FieldName: string; // Name of the field
    fieldValue: DocumentInfoFieldValue; // Value of the field
    PropertyID: string; // Linked property ID
    CreatedAt: string; // Creation timestamp
    UpdatedAt: string; // Last update timestamp
  };
}

// Response structure for document info API (multiple items)
export interface DocumentInfoGetResponse {
  success: boolean; // Indicates if the API call was successful
  message: string; // Response message
  data?: Array<{
    ID: string; // Unique document info ID
    FieldName: string; // Name of the field
    fieldValue: DocumentInfoFieldValue; // Value of the field
    PropertyID: string; // Linked property ID
    CreatedAt: string; // Creation timestamp
    UpdatedAt: string; // Last update timestamp
  }>;
}