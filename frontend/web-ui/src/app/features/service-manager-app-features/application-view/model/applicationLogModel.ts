
// Request body for creating a new application log entry (POST)
export interface PostApplicationLogRequest {
  action: string;
  performedBy: string;
  comments: string;
  metadata?: object | null;
  fileStoreId?: string | null;
  applicationId: string;
  actor: string;
}


// Response body for creating a new application log entry (POST)
export interface PostApplicationLogResponse {
  data: {
    ID: string;
    Action: string;
    PerformedBy: string;
    PerformedDate: string;
    Comments: string;
    Metadata: string;
    FileStoreID: string | null;
    ApplicationID: string;
    CreatedAt: string;
    Actor: string;
  };
  message: string;           // Response message from the API
  success: boolean;          // Indicates if the operation was successful
}