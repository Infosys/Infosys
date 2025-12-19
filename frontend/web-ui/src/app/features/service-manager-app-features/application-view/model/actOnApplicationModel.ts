
// Request payload for acting on an application (e.g., approve, reject, etc.)
export interface ActOnApplicationRequest {
  action : string;         // The action to perform (e.g., 'approve', 'reject')
  applicationId: string;   // The ID of the application to act on
  propertyId: string;      // The ID of the related property
  comments: string;        // Any comments or notes for the action
}


// Response payload for acting on an application
export interface ActOnApplicationResponse {
  success: boolean; // Indicates if the action was successful
  message: string;  // Response message from the API
}